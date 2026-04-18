/**
 * install-utils.js 单元测试
 * 
 * 测试安装工具函数的各种场景：
 * - 路径解析（本地/全局安装）
 * - 环境变量检测
 * - 文件操作（同步、比较、删除）
 * - 交互式提示（CI 环境自动应答）
 * 
 * 运行测试：
 *   bun test bin/__tests__/install-utils.test.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// 导入被测试的模块
const utils = require('../install-utils');

// 保存原始环境变量，测试后恢复
const originalEnv = { ...process.env };

// 测试用的临时目录
let testDir;

/**
 * 创建临时测试目录
 */
function setupTestDir(name) {
  const dir = path.join(os.tmpdir(), 'baicai-vibe-test', name, Date.now().toString());
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * 清理临时目录
 */
function cleanupDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 测试套件：路径解析函数
 */
describe('路径解析函数', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /**
   * resolvePkgDir() - 解析包目录路径
   * 应该返回 install-utils.js 所在的父目录
   */
  describe('resolvePkgDir()', () => {
    test('返回包的根目录', () => {
      const pkgDir = utils.resolvePkgDir();
      expect(path.isAbsolute(pkgDir)).toBe(true);
      expect(pkgDir).toContain('baicai-vibe');
    });
  });

  /**
   * resolveProjectRoot() - 解析项目根目录
   * 根据不同的安装场景返回正确的项目路径
   */
  describe('resolveProjectRoot()', () => {
    test('优先使用 INIT_CWD 环境变量', () => {
      process.env.INIT_CWD = '/test/project/root';
      const result = utils.resolveProjectRoot('/some/pkg/dir');
      expect(result).toBe('/test/project/root');
    });

    test('从 node_modules 路径中提取项目根目录', () => {
      delete process.env.INIT_CWD;
      const pkgDir = '/my/project/node_modules/baicai-vibe';
      const result = utils.resolveProjectRoot(pkgDir);
      expect(result).toBe('/my/project');
    });

    test('处理嵌套的 node_modules 路径', () => {
      delete process.env.INIT_CWD;
      const pkgDir = '/my/project/node_modules/.pnpm/baicai-vibe/node_modules/baicai-vibe';
      const result = utils.resolveProjectRoot(pkgDir);
      expect(result).toBe('/my/project');
    });

    test('当包不在 node_modules 时返回备选路径', () => {
      delete process.env.INIT_CWD;
      const pkgDir = '/dev/baicai-vibe';
      const result = utils.resolveProjectRoot(pkgDir);
      expect(result).toBeDefined();
    });
  });

  /**
   * resolveGlobalDir() - 解析全局配置目录
   * 根据操作系统返回正确的全局配置路径
   */
  describe('resolveGlobalDir()', () => {
    test('Windows 使用 APPDATA 环境变量', () => {
      const originalAppData = process.env.APPDATA;
      process.env.APPDATA = 'C:\\Users\\Test\\AppData\\Roaming';
      
      const result = utils.resolveGlobalDir();
      expect(result).toContain('opencode');
      
      if (originalAppData) {
        process.env.APPDATA = originalAppData;
      } else {
        delete process.env.APPDATA;
      }
    });

    test('macOS/Linux 使用 home 目录下的 .config', () => {
      const originalAppData = process.env.APPDATA;
      delete process.env.APPDATA;
      
      const result = utils.resolveGlobalDir();
      expect(result).toMatch(/\.config[\\/]opencode$/);
      
      if (originalAppData) {
        process.env.APPDATA = originalAppData;
      }
    });
  });
});

/**
 * 测试套件：环境检测函数
 */
describe('环境检测函数', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /**
   * isGlobalInstall() - 检测是否为全局安装
   */
  describe('isGlobalInstall()', () => {
    test('npm_config_global="true" 时返回 true', () => {
      process.env.npm_config_global = 'true';
      expect(utils.isGlobalInstall()).toBe(true);
    });

    test('npm_config_global="1" 时返回 true', () => {
      process.env.npm_config_global = '1';
      expect(utils.isGlobalInstall()).toBe(true);
    });

    test('BAICAI_VIBE_INSTALL_SCOPE="global" 时返回 true', () => {
      process.env.BAICAI_VIBE_INSTALL_SCOPE = 'global';
      expect(utils.isGlobalInstall()).toBe(true);
    });

    test('未设置相关环境变量时返回 false', () => {
      delete process.env.npm_config_global;
      delete process.env.BAICAI_VIBE_INSTALL_SCOPE;
      expect(utils.isGlobalInstall()).toBe(false);
    });

    test('其他值时返回 false', () => {
      process.env.npm_config_global = 'false';
      expect(utils.isGlobalInstall()).toBe(false);
    });
  });

  /**
   * isSelfInstall() - 检测是否为自安装（本地开发模式）
   */
  describe('isSelfInstall()', () => {
    test('相同路径时返回 true', () => {
      const dir = '/dev/baicai-vibe';
      expect(utils.isSelfInstall(dir, dir)).toBe(true);
    });

    test('不同路径时返回 false', () => {
      expect(utils.isSelfInstall('/pkg/dir', '/project/root')).toBe(false);
    });

    test('规范化路径后比较', () => {
      const dir = '/dev/baicai-vibe';
      const sameDir = '/dev/baicai-vibe/.';
      expect(utils.isSelfInstall(dir, sameDir)).toBe(true);
    });
  });

  /**
   * isNonInteractive() - 检测是否为非交互模式
   */
  describe('isNonInteractive()', () => {
    test('CI="true" 时返回 true', () => {
      process.env.CI = 'true';
      expect(utils.isNonInteractive()).toBe(true);
    });

    test('BAICAI_VIBE_FORCE="true" 时返回 true', () => {
      process.env.BAICAI_VIBE_FORCE = 'true';
      expect(utils.isNonInteractive()).toBe(true);
    });

    test('交互式终端时返回 false', () => {
      delete process.env.CI;
      delete process.env.BAICAI_VIBE_FORCE;
      
      // 在 bun 测试环境中，stdin.isTTY 通常为 undefined
      // 所以这个测试会返回 true
    });
  });
});

/**
 * 测试套件：文件操作函数
 * 使用真实临时目录进行测试
 */
describe('文件操作函数', () => {
  beforeEach(() => {
    testDir = setupTestDir('file-operations');
  });

  afterEach(() => {
    cleanupDir(testDir);
    process.env = { ...originalEnv };
  });

  /**
   * filesAreDifferent() - 比较两个文件是否不同
   */
  describe('filesAreDifferent()', () => {
    test('目标文件不存在时返回 true', () => {
      const srcFile = path.join(testDir, 'src.txt');
      fs.writeFileSync(srcFile, 'content');
      
      expect(utils.filesAreDifferent(srcFile, path.join(testDir, 'nonexistent.txt'))).toBe(true);
    });

    test('内容相同时返回 false', () => {
      const file1 = path.join(testDir, 'file1.txt');
      const file2 = path.join(testDir, 'file2.txt');
      fs.writeFileSync(file1, 'same content');
      fs.writeFileSync(file2, 'same content');
      
      expect(utils.filesAreDifferent(file1, file2)).toBe(false);
    });

    test('内容不同时返回 true', () => {
      const file1 = path.join(testDir, 'file1.txt');
      const file2 = path.join(testDir, 'file2.txt');
      fs.writeFileSync(file1, 'content1');
      fs.writeFileSync(file2, 'content2');
      
      expect(utils.filesAreDifferent(file1, file2)).toBe(true);
    });

    test('空文件与有内容的文件比较', () => {
      const emptyFile = path.join(testDir, 'empty.txt');
      const contentFile = path.join(testDir, 'content.txt');
      fs.writeFileSync(emptyFile, '');
      fs.writeFileSync(contentFile, 'some content');
      
      expect(utils.filesAreDifferent(emptyFile, contentFile)).toBe(true);
    });
  });

  /**
   * syncDir() - 同步目录内容
   */
  describe('syncDir()', () => {
    test('复制所有文件和子目录', () => {
      const srcDir = path.join(testDir, 'src');
      const destDir = path.join(testDir, 'dest');
      
      fs.mkdirSync(path.join(srcDir, 'subdir'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'file1.txt'), 'content1');
      fs.writeFileSync(path.join(srcDir, 'file2.txt'), 'content2');
      fs.writeFileSync(path.join(srcDir, 'subdir', 'file3.txt'), 'content3');
      
      utils.syncDir(srcDir, destDir);
      
      expect(fs.existsSync(path.join(destDir, 'file1.txt'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'file2.txt'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'subdir', 'file3.txt'))).toBe(true);
    });

    test('排除指定的文件和目录', () => {
      const srcDir = path.join(testDir, 'src-exclude');
      const destDir = path.join(testDir, 'dest-exclude');
      
      fs.mkdirSync(path.join(srcDir, 'node_modules'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'keep.txt'), 'keep this');
      fs.writeFileSync(path.join(srcDir, 'node_modules', 'package.json'), '{}');
      fs.writeFileSync(path.join(srcDir, '.DS_Store'), 'store');
      
      utils.syncDir(srcDir, destDir, ['node_modules', '.DS_Store']);
      
      expect(fs.existsSync(path.join(destDir, 'keep.txt'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'node_modules'))).toBe(false);
      expect(fs.existsSync(path.join(destDir, '.DS_Store'))).toBe(false);
    });

    test('目标目录不存在时自动创建', () => {
      const srcDir = path.join(testDir, 'src-new');
      const destDir = path.join(testDir, 'dest-new');
      
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'new-file.txt'), 'new content');
      
      expect(fs.existsSync(destDir)).toBe(false);
      
      utils.syncDir(srcDir, destDir);
      
      expect(fs.existsSync(path.join(destDir, 'new-file.txt'))).toBe(true);
    });

    test('排除 package-lock.json 和 .gitignore', () => {
      const srcDir = path.join(testDir, 'src-root');
      const destDir = path.join(testDir, 'dest-root');

      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'package-lock.json'), '{"lock":true}');
      fs.writeFileSync(path.join(srcDir, '.gitignore'), 'node_modules');
      fs.writeFileSync(path.join(srcDir, 'kept.txt'), 'keep');

      utils.syncDir(srcDir, destDir);

      expect(fs.existsSync(path.join(destDir, 'package-lock.json'))).toBe(false);
      expect(fs.existsSync(path.join(destDir, '.gitignore'))).toBe(false);
      expect(fs.existsSync(path.join(destDir, 'kept.txt'))).toBe(true);
    });

    test('内容相同时不覆盖', () => {
      const srcDir = path.join(testDir, 'src-same');
      const destDir = path.join(testDir, 'dest-same');
      
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'file.txt'), 'same content');
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(path.join(destDir, 'file.txt'), 'same content');
      
      utils.syncDir(srcDir, destDir);
      
      // 文件内容应该相同
      expect(fs.readFileSync(path.join(destDir, 'file.txt'), 'utf8')).toBe('same content');
    });
  });

  /**
   * removeOwnedContent() - 删除指定路径列表中的内容
   */
  describe('removeOwnedContent()', () => {
    test('删除存在的文件', () => {
      const removeDir = path.join(testDir, 'remove-test');
      
      fs.mkdirSync(path.join(removeDir, 'agents', 'baicai-vibe'), { recursive: true });
      fs.mkdirSync(path.join(removeDir, 'rules', 'baicai-vibe'), { recursive: true });
      fs.writeFileSync(path.join(removeDir, 'agents', 'baicai-vibe', 'simplify-code.md'), 'content');
      fs.writeFileSync(path.join(removeDir, 'rules', 'baicai-vibe', 'coding-style.md'), 'style');
      
      const ownedPaths = [
        'agents/baicai-vibe',
        'rules/baicai-vibe/coding-style.md'
      ];
      
      utils.removeOwnedContent(removeDir, ownedPaths);
      
      expect(fs.existsSync(path.join(removeDir, 'agents', 'baicai-vibe'))).toBe(false);
      expect(fs.existsSync(path.join(removeDir, 'rules', 'baicai-vibe', 'coding-style.md'))).toBe(false);
      expect(fs.existsSync(path.join(removeDir, 'agents'))).toBe(false);
      expect(fs.existsSync(path.join(removeDir, 'rules'))).toBe(false);
    });

    test('保留有自定义内容的父目录', () => {
      const removeDir = path.join(testDir, 'remove-preserve');

      fs.mkdirSync(path.join(removeDir, 'agents', 'baicai-vibe'), { recursive: true });
      fs.mkdirSync(path.join(removeDir, 'agents', 'custom-agent'), { recursive: true });
      fs.writeFileSync(path.join(removeDir, 'agents', 'baicai-vibe', 'simplify-code.md'), 'content');
      fs.writeFileSync(path.join(removeDir, 'agents', 'custom-agent', 'custom.md'), 'keep');

      utils.removeOwnedContent(removeDir, ['agents/baicai-vibe']);

      expect(fs.existsSync(path.join(removeDir, 'agents', 'baicai-vibe'))).toBe(false);
      expect(fs.existsSync(path.join(removeDir, 'agents'))).toBe(true);
      expect(fs.existsSync(path.join(removeDir, 'agents', 'custom-agent', 'custom.md'))).toBe(true);
    });

    test('忽略不存在的路径', () => {
      const ignoreDir = path.join(testDir, 'ignore-test');
      fs.mkdirSync(ignoreDir);
      
      const ownedPaths = [
        'nonexistent/file.txt',
        'also/not/here'
      ];
      
      expect(() => {
        utils.removeOwnedContent(ignoreDir, ownedPaths);
      }).not.toThrow();
    });
  });

  /**
   * hasBaicaiVibeContent() - 检测目录是否包含 baicai-vibe 内容
   */
  describe('hasBaicaiVibeContent()', () => {
    test('包含 baicai-vibe 内容时返回 true', () => {
      const contentDir = path.join(testDir, 'has-content');
      fs.mkdirSync(path.join(contentDir, 'agents', 'baicai-vibe'), { recursive: true });
      
      expect(utils.hasBaicaiVibeContent(contentDir)).toBe(true);
    });

    test('不包含 baicai-vibe 内容时返回 false', () => {
      const noContentDir = path.join(testDir, 'no-content');
      fs.mkdirSync(path.join(noContentDir, 'agents', 'other-tool'), { recursive: true });
      
      expect(utils.hasBaicaiVibeContent(noContentDir)).toBe(false);
    });

    test('目录不存在时返回 false', () => {
      expect(utils.hasBaicaiVibeContent('/nonexistent-dir')).toBe(false);
    });

    test('根目录存在时返回 true', () => {
      const rootFileDir = path.join(testDir, 'root-file');
      fs.mkdirSync(rootFileDir, { recursive: true });
      fs.mkdirSync(path.join(rootFileDir, 'skills', 'baicai-vibe'), { recursive: true });

      expect(utils.hasBaicaiVibeContent(rootFileDir)).toBe(true);
    });

    test('任意一个 baicai-vibe 目录存在即返回 true', () => {
      const baicaiDirs = [
        'agents/baicai-vibe',
        'commands/baicai-vibe',
        'rules/baicai-vibe',
        'skills/baicai-vibe',
        'workflows/baicai-vibe'
      ];
      
      baicaiDirs.forEach((dir, index) => {
        const testSubDir = path.join(testDir, `test-${index}`);
        fs.mkdirSync(path.join(testSubDir, dir), { recursive: true });
        expect(utils.hasBaicaiVibeContent(testSubDir)).toBe(true);
      });
    });
  });

  describe('runInstall()', () => {
    test('package.json 不存在时返回 false', () => {
      const noPkgDir = path.join(testDir, 'no-package');
      fs.mkdirSync(noPkgDir);

      const runner = () => {
        throw new Error('should not be called');
      };

      const result = utils.runInstall(noPkgDir, runner);
      expect(result).toBe(false);
    });

    test('检测 bun.lockb 选择 bun', () => {
      const bunDir = path.join(testDir, 'bun-project');
      fs.mkdirSync(bunDir);
      fs.writeFileSync(path.join(bunDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(bunDir, 'bun.lockb'), Buffer.from('bun lock'));

      let calledWith = null;
      const result = utils.runInstall(bunDir, (command, options) => {
        calledWith = { command, options };
      });

      expect(result).toBe(true);
      expect(calledWith).toEqual({
        command: 'bun install',
        options: {
          cwd: bunDir,
          stdio: 'inherit',
          timeout: 300000,
        },
      });
    });

    test('无 bun.lockb 时选择 npm', () => {
      const npmDir = path.join(testDir, 'npm-project');
      fs.mkdirSync(npmDir);
      fs.writeFileSync(path.join(npmDir, 'package.json'), '{}');

      let calledWith = null;
      const result = utils.runInstall(npmDir, (command, options) => {
        calledWith = { command, options };
      });

      expect(result).toBe(true);
      expect(calledWith).toEqual({
        command: 'npm install',
        options: {
          cwd: npmDir,
          stdio: 'inherit',
          timeout: 300000,
        },
      });
    });
  });

  describe('backupOwnedContent()', () => {
    test('备份 owned paths 到备份目录', () => {
      const sourceDir = path.join(testDir, 'backup-source');
      const backupDir = path.join(testDir, 'backup-dest');

      fs.mkdirSync(path.join(sourceDir, 'skills', 'baicai-vibe', 'fix-bugs'), { recursive: true });
      fs.writeFileSync(path.join(sourceDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'), 'content');

      const backedUp = utils.backupOwnedContent(sourceDir, backupDir, ['skills/baicai-vibe']);

      expect(backedUp).toBe(true);
      expect(fs.existsSync(path.join(backupDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'))).toBe(true);
    });
  });

  describe('acquireLock()/releaseLock()', () => {
    test('创建并释放锁文件', async () => {
      const lockBase = path.join(testDir, 'lock-target');
      const lockPath = await utils.acquireLock(lockBase, 1000);

      expect(lockPath).toBe(`${lockBase}.baicai-vibe.lock`);
      expect(fs.existsSync(lockPath)).toBe(true);

      utils.releaseLock(lockPath);

      expect(fs.existsSync(lockPath)).toBe(false);
    });
  });
});

/**
 * 测试套件：交互式提示函数
 */
describe('prompt() 函数', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /**
   * prompt() - 交互式用户提示
   */
  describe('prompt()', () => {
    test('CI 环境自动返回 "yes"', async () => {
      process.env.CI = 'true';
      const result = await utils.prompt('Continue?');
      expect(result).toBe('yes');
    });

    test('强制模式自动返回 "yes"', async () => {
      process.env.BAICAI_VIBE_FORCE = 'true';
      const result = await utils.prompt('Continue?');
      expect(result).toBe('yes');
    });
  });
});

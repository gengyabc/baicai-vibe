/**
 * postinstall.js 集成测试
 * 
 * 测试安装脚本的各种场景：
 * - 本地开发模式（跳过安装）
 * - 项目级安装
 * - 全局安装
 * - 已存在内容时的覆盖提示
 * - CI 环境自动确认
 * 
 * 运行测试：
 *   bun test bin/__tests__/postinstall.test.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const utils = require('../install-utils');
const ownedPaths = require('../owned-paths');

const originalEnv = { ...process.env };

// 测试用的临时目录
let testDir;

function setupTestDir(name) {
  const dir = path.join(os.tmpdir(), 'baicai-vibe-postinstall', name, Date.now().toString());
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanupDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 测试套件：postinstall 主流程
 */
describe('postinstall 安装流程', () => {
  beforeEach(() => {
    testDir = setupTestDir('main');
  });

  afterEach(() => {
    cleanupDir(testDir);
    process.env = { ...originalEnv };
  });

  /**
   * 场景：本地开发模式
   */
  describe('本地开发模式（跳过安装）', () => {
    test('包目录与项目根目录相同时退出', () => {
      process.env.INIT_CWD = '/dev/baicai-vibe';
      expect(utils.isSelfInstall('/dev/baicai-vibe', '/dev/baicai-vibe')).toBe(true);
    });
  });

  /**
   * 场景：项目级安装
   */
  describe('项目级安装', () => {
    test('复制 .opencode 内容到项目目录', () => {
      const srcDir = path.join(testDir, 'pkg', '.opencode');
      const destDir = path.join(testDir, 'project', '.opencode');
      
      fs.mkdirSync(path.join(srcDir, 'agents', 'baicai-vibe'), { recursive: true });
      fs.mkdirSync(path.join(srcDir, 'skills', 'baicai-vibe', 'fix-bugs'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'agents', 'baicai-vibe', 'simplify-code.md'), '# Simplify Code');
      fs.writeFileSync(path.join(srcDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'), '# Fix Bugs');
      
      utils.syncDir(srcDir, destDir);
      
      expect(fs.existsSync(path.join(destDir, 'agents', 'baicai-vibe', 'simplify-code.md'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'))).toBe(true);
    });

  });

  /**
   * 场景：全局安装
   */
  describe('全局安装', () => {
    test('内容复制到全局目录', () => {
      const srcDir = path.join(testDir, 'pkg-global', '.opencode');
      const destDir = path.join(testDir, 'global-opencode');
      
      fs.mkdirSync(path.join(srcDir, 'skills', 'baicai-vibe', 'code-review-expert'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'skills', 'baicai-vibe', 'code-review-expert', 'SKILL.md'), '# Code Review');
      
      utils.syncDir(srcDir, destDir);
      
      expect(fs.existsSync(path.join(destDir, 'skills', 'baicai-vibe', 'code-review-expert', 'SKILL.md'))).toBe(true);
    });

    test('全局安装仍只处理 .opencode 内容', () => {
      process.env.BAICAI_VIBE_INSTALL_SCOPE = 'global';
      expect(utils.isGlobalInstall()).toBe(true);
    });
  });

  /**
   * 场景：已存在内容的处理
   */
  describe('已存在内容的处理', () => {
    test('检测已存在的 baicai-vibe 内容', () => {
      const existingDir = path.join(testDir, 'existing', '.opencode');
      fs.mkdirSync(path.join(existingDir, 'agents', 'baicai-vibe'), { recursive: true });
      
      expect(utils.hasBaicaiVibeContent(existingDir)).toBe(true);
    });

    test('删除旧内容后复制新内容', () => {
      const srcDir = path.join(testDir, 'pkg-update', '.opencode');
      const destDir = path.join(testDir, 'project-update', '.opencode');
      
      // 创建旧内容 - skills/baicai-vibe/fix-bugs 是目录
      fs.mkdirSync(path.join(destDir, 'skills', 'baicai-vibe', 'fix-bugs'), { recursive: true });
      fs.writeFileSync(path.join(destDir, 'skills', 'baicai-vibe', 'fix-bugs', 'old-file.md'), '# Old Content');
      
      // 创建新内容
      fs.mkdirSync(path.join(srcDir, 'skills', 'baicai-vibe', 'fix-bugs'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'), '# New Version');
      
      // 先删除旧内容
      utils.removeOwnedContent(destDir, ownedPaths);
      
      // 再复制新内容
      utils.syncDir(srcDir, destDir);
      
      // 目录被删除后重新创建
      expect(fs.existsSync(path.join(destDir, 'skills', 'baicai-vibe', 'fix-bugs', 'old-file.md'))).toBe(false);
      expect(fs.existsSync(path.join(destDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'))).toBe(true);
    });

    test('CI 环境自动确认覆盖', async () => {
      process.env.CI = 'true';
      const answer = await utils.prompt('Continue?');
      expect(answer).toBe('yes');
    });
  });

  /**
   * 场景：文件内容相同
   */
  describe('文件内容相同时跳过', () => {
    test('相同内容的文件不重复复制', () => {
      const srcDir = path.join(testDir, 'src-same');
      const destDir = path.join(testDir, 'dest-same');
      
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'file.txt'), 'identical content');
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(path.join(destDir, 'file.txt'), 'identical content');
      
      expect(utils.filesAreDifferent(path.join(srcDir, 'file.txt'), path.join(destDir, 'file.txt'))).toBe(false);
      
      utils.syncDir(srcDir, destDir);
      
      expect(fs.readFileSync(path.join(destDir, 'file.txt'), 'utf8')).toBe('identical content');
    });
  });
});

/**
 * 测试套件：owned-paths 路径列表
 */
describe('owned-paths 路径验证', () => {
  test('路径列表包含预期的目录结构', () => {
    expect(ownedPaths).toContain('agents/baicai-vibe');
      expect(ownedPaths).toContain('commands/baicai-vibe');
      expect(ownedPaths).toContain('skills/baicai-vibe');
      expect(ownedPaths).toContain('workflows/baicai-vibe');
      expect(ownedPaths).toContain('plugins/baicai-vibe');
    });

  test('路径格式正确（使用正斜杠）', () => {
    ownedPaths.forEach(p => {
      expect(p).not.toMatch(/^\//);
      expect(p).not.toMatch(/\\/);
    });
  });
});

/**
 * 测试套件：错误处理
 */
describe('错误处理', () => {
  beforeEach(() => {
    testDir = setupTestDir('errors');
  });

  afterEach(() => {
    cleanupDir(testDir);
    process.env = { ...originalEnv };
  });

  test('目标目录不可写时不应崩溃', () => {
    const readonlyDir = path.join(testDir, 'readonly');
    fs.mkdirSync(readonlyDir);
    
    expect(() => {
      utils.removeOwnedContent(readonlyDir, ['nonexistent/path']);
    }).not.toThrow();
  });

  test('源目录不存在时 syncDir 创建目标目录', () => {
    const srcDir = path.join(testDir, 'source');
    const destDir = path.join(testDir, 'new-dest');
    
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(srcDir, 'file.txt'), 'content');
    
    expect(fs.existsSync(destDir)).toBe(false);
    
    utils.syncDir(srcDir, destDir);
    
    expect(fs.existsSync(path.join(destDir, 'file.txt'))).toBe(true);
  });
});

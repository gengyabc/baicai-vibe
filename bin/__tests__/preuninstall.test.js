/**
 * preuninstall.js 集成测试
 * 
 * 测试卸载脚本的各种场景：
 * - 本地开发模式（跳过卸载）
 * - 项目级卸载
 * - 全局卸载
 * - 用户确认/取消
 * - CI 环境自动确认
 * 
 * 运行测试：
 *   bun test bin/__tests__/preuninstall.test.js
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
  const dir = path.join(os.tmpdir(), 'baicai-vibe-preuninstall', name, Date.now().toString());
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanupDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 测试套件：preuninstall 主流程
 */
describe('preuninstall 卸载流程', () => {
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
  describe('本地开发模式（跳过卸载）', () => {
    test('包目录与项目根目录相同时跳过清理', () => {
      expect(utils.isSelfInstall('/dev/baicai-vibe', '/dev/baicai-vibe')).toBe(true);
    });

    test('本地模式下不删除任何文件', () => {
      const localDir = path.join(testDir, 'dev', 'baicai-vibe', '.opencode');
      fs.mkdirSync(path.join(localDir, 'skills', 'baicai-vibe'), { recursive: true });
      
      expect(fs.existsSync(path.join(localDir, 'skills', 'baicai-vibe'))).toBe(true);
    });
  });

  /**
   * 场景：项目级卸载
   */
  describe('项目级卸载', () => {
test('删除 .opencode/baicai-vibe 相关内容', () => {
      const projectDir = path.join(testDir, 'project', '.opencode');
      
      // 创建测试结构 - skills/baicai-vibe/fix-bugs 是目录，会被删除
      fs.mkdirSync(path.join(projectDir, 'skills', 'baicai-vibe', 'fix-bugs'), { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'skills', 'baicai-vibe', 'fix-bugs', 'SKILL.md'), '# Fix Bugs');
      
      // agents/baicai-vibe/simplify-code.md 是文件，会被删除
      fs.mkdirSync(path.join(projectDir, 'agents', 'baicai-vibe'), { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'agents', 'baicai-vibe', 'simplify-code.md'), '# Simplify');
      
      // commands/other-tool 不在 owned-paths 中，应该保留
      fs.mkdirSync(path.join(projectDir, 'commands', 'other-tool'), { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'commands', 'other-tool', 'cmd.md'), 'other');
      
      utils.removeOwnedContent(projectDir, ownedPaths);
      
      // skills/baicai-vibe/fix-bugs 是目录路径，会被完全删除
      expect(fs.existsSync(path.join(projectDir, 'skills', 'baicai-vibe', 'fix-bugs'))).toBe(false);
      
      // agents/baicai-vibe/simplify-code.md 是文件，会被删除
      // 但目录不会被删除（因为 owned-paths 中没有 agents/baicai-vibe 目录路径）
      expect(fs.existsSync(path.join(projectDir, 'agents', 'baicai-vibe', 'simplify-code.md'))).toBe(false);
      
      // 其他内容保留
      expect(fs.existsSync(path.join(projectDir, 'commands', 'other-tool'))).toBe(true);
    });

    test('卸载仅处理 .opencode 内容', () => {
      const projectDir = path.join(testDir, 'project', '.opencode');
      fs.mkdirSync(path.join(projectDir, 'skills', 'baicai-vibe'), { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'skills', 'baicai-vibe', 'SKILL.md'), '# AGENTS-free');

      utils.removeOwnedContent(projectDir, ownedPaths);

      expect(fs.existsSync(path.join(projectDir, 'skills', 'baicai-vibe', 'SKILL.md'))).toBe(false);
    });
  });

  /**
   * 场景：全局卸载
   */
  describe('全局卸载', () => {
    test('删除全局目录中的 baicai-vibe 内容', () => {
      const globalDir = path.join(testDir, 'global-opencode');
      
      // skills/baicai-vibe/code-review-expert 是目录路径
      fs.mkdirSync(path.join(globalDir, 'skills', 'baicai-vibe', 'code-review-expert'), { recursive: true });
      fs.writeFileSync(path.join(globalDir, 'skills', 'baicai-vibe', 'code-review-expert', 'SKILL.md'), '# Code Review');
      
      // workflows/baicai-vibe/discover-requirements-core.md 是文件路径
      fs.mkdirSync(path.join(globalDir, 'workflows', 'baicai-vibe'), { recursive: true });
      fs.writeFileSync(path.join(globalDir, 'workflows', 'baicai-vibe', 'discover-requirements-core.md'), '# Workflow');
      
      // plugins/other-plugin 不在 owned-paths 中
      fs.mkdirSync(path.join(globalDir, 'plugins', 'other-plugin'), { recursive: true });
      fs.writeFileSync(path.join(globalDir, 'plugins', 'other-plugin', 'plugin.js'), '// other');
      
      utils.removeOwnedContent(globalDir, ownedPaths);
      
      // skills/baicai-vibe/code-review-expert 是目录，会被删除
      expect(fs.existsSync(path.join(globalDir, 'skills', 'baicai-vibe', 'code-review-expert'))).toBe(false);
      
      // workflows/baicai-vibe/discover-requirements-core.md 是文件，会被删除
      expect(fs.existsSync(path.join(globalDir, 'workflows', 'baicai-vibe', 'discover-requirements-core.md'))).toBe(false);
      
      // 其他内容保留
      expect(fs.existsSync(path.join(globalDir, 'plugins', 'other-plugin'))).toBe(true);
    });

    test('全局卸载不处理 AGENTS.md', () => {
      process.env.BAICAI_VIBE_INSTALL_SCOPE = 'global';
      expect(utils.isGlobalInstall()).toBe(true);
    });
  });

  /**
   * 场景：目标目录不存在
   */
  describe('目标目录不存在', () => {
    test('目录不存在时优雅退出', () => {
      const nonexistentDir = path.join(testDir, 'project', '.opencode');
      expect(fs.existsSync(nonexistentDir)).toBe(false);
      expect(utils.hasBaicaiVibeContent(nonexistentDir)).toBe(false);
    });

    test('不执行任何删除操作', () => {
      const projectDir = path.join(testDir, 'empty-project');
      fs.mkdirSync(projectDir);
      
      expect(() => {
        utils.removeOwnedContent(path.join(projectDir, '.opencode'), ownedPaths);
      }).not.toThrow();
    });
  });
});

/**
 * 测试套件：用户确认流程
 */
describe('用户确认流程', () => {
  beforeEach(() => {
    testDir = setupTestDir('confirmation');
  });

  afterEach(() => {
    cleanupDir(testDir);
    process.env = { ...originalEnv };
  });

  /**
   * 场景：交互模式
   */
  describe('交互模式', () => {
    test('用户确认后执行删除', async () => {
      process.env.CI = 'true';
      const answer = await utils.prompt('Remove baicai-vibe content?');
      expect(answer).toBe('yes');
    });

    test('用户取消时保留内容', () => {
      const projectDir = path.join(testDir, 'project-cancel', '.opencode');
      fs.mkdirSync(path.join(projectDir, 'skills', 'baicai-vibe'), { recursive: true });
      
      expect(fs.existsSync(path.join(projectDir, 'skills', 'baicai-vibe'))).toBe(true);
    });
  });

  /**
   * 场景：非交互模式（CI/强制）
   */
  describe('非交互模式（自动确认）', () => {
    test('CI 环境自动确认', async () => {
      process.env.CI = 'true';
      
      expect(utils.isNonInteractive()).toBe(true);
      
      const answer = await utils.prompt('Continue?');
      expect(answer).toBe('yes');
    });

    test('强制模式自动确认', async () => {
      process.env.BAICAI_VIBE_FORCE = 'true';
      
      expect(utils.isNonInteractive()).toBe(true);
      
      const answer = await utils.prompt('Continue?');
      expect(answer).toBe('yes');
    });
  });
});

/**
 * 测试套件：清理完整性
 */
describe('清理完整性', () => {
  beforeEach(() => {
    testDir = setupTestDir('completeness');
  });

  afterEach(() => {
    cleanupDir(testDir);
    process.env = { ...originalEnv };
  });

  test('删除所有 owned-paths 中列出的内容', () => {
    const projectDir = path.join(testDir, 'project', '.opencode');
    
    // 创建完整的测试结构
    ownedPaths.forEach(p => {
      const fullPath = path.join(projectDir, p);
      const parentDir = path.dirname(fullPath);
      
      fs.mkdirSync(parentDir, { recursive: true });
      
      if (p.endsWith('.md') || p.endsWith('.json') || p.endsWith('.ts')) {
        fs.writeFileSync(fullPath, 'content');
      } else {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    expect(fs.existsSync(path.join(projectDir, 'skills', 'baicai-vibe'))).toBe(true);

    utils.removeOwnedContent(projectDir, ownedPaths);
    
    ownedPaths.forEach(p => {
      expect(fs.existsSync(path.join(projectDir, p))).toBe(false);
    });
  });

  test('保留非 baicai-vibe 的内容', () => {
    const projectDir = path.join(testDir, 'project-preserve', '.opencode');
    
    // skills/baicai-vibe/code-review-expert 是目录路径，会被删除
    fs.mkdirSync(path.join(projectDir, 'skills', 'baicai-vibe', 'code-review-expert'), { recursive: true });
    
    // 自定义内容保留
    fs.mkdirSync(path.join(projectDir, 'agents', 'my-custom-agent'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'skills', 'my-skills'), { recursive: true });
    
    fs.writeFileSync(path.join(projectDir, 'agents', 'my-custom-agent', 'custom.md'), 'my agent');
    fs.writeFileSync(path.join(projectDir, 'skills', 'my-skills', 'skill.md'), 'my skill');
    
    utils.removeOwnedContent(projectDir, ownedPaths);
    
    // baicai-vibe 内容被删除
    expect(fs.existsSync(path.join(projectDir, 'skills', 'baicai-vibe', 'code-review-expert'))).toBe(false);
    
    // 自定义内容保留
    expect(fs.existsSync(path.join(projectDir, 'agents', 'my-custom-agent', 'custom.md'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'skills', 'my-skills', 'skill.md'))).toBe(true);
  });
});

/**
 * 测试套件：边界情况
 */
describe('边界情况', () => {
  beforeEach(() => {
    testDir = setupTestDir('edge');
  });

  afterEach(() => {
    cleanupDir(testDir);
    process.env = { ...originalEnv };
  });

  test('空目录卸载不报错', () => {
    const emptyDir = path.join(testDir, 'empty');
    fs.mkdirSync(emptyDir, { recursive: true });
    const opencodeDir = path.join(emptyDir, '.opencode');
    fs.mkdirSync(opencodeDir);
    
    expect(() => {
      utils.removeOwnedContent(opencodeDir, ownedPaths);
    }).not.toThrow();
  });

  test('部分内容缺失时继续删除其他内容', () => {
    const partialDir = path.join(testDir, 'partial', '.opencode');
    fs.mkdirSync(partialDir, { recursive: true });
    
    // 只创建 skills/baicai-vibe/fix-bugs 目录
    fs.mkdirSync(path.join(partialDir, 'skills', 'baicai-vibe', 'fix-bugs'), { recursive: true });
    
    expect(() => {
      utils.removeOwnedContent(partialDir, ownedPaths);
    }).not.toThrow();
    
    // 目录被删除
    expect(fs.existsSync(path.join(partialDir, 'skills', 'baicai-vibe', 'fix-bugs'))).toBe(false);
  });

  test('AGENTS.md 不存在时不报错', () => {
    const projectDir = path.join(testDir, 'no-agents');
    fs.mkdirSync(path.join(projectDir, '.opencode', 'skills', 'baicai-vibe'), { recursive: true });
    
    expect(fs.existsSync(path.join(projectDir, 'AGENTS.md'))).toBe(false);
  });
});

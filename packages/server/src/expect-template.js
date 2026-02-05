/**
 * 生成 expect 脚本模板
 * @param {string} claudePath - Claude CLI 路径
 * @returns {string} expect 脚本内容
 */
function generateExpectScript(claudePath) {
  return `#!/usr/bin/expect -f

# 设置超时
set timeout -1

# 禁用输出到标准输出的过滤
log_user 1

# 启动 claude
spawn ${claudePath}

# 交互模式 - 不做任何额外处理，直接转发所有输入输出
interact
`;
}

module.exports = {
  generateExpectScript,
};

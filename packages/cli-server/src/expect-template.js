/**
 * Generate expect script template
 * @param {string} claudePath - Claude CLI path
 * @returns {string} expect script content
 */
function generateExpectScript(claudePath) {
  return `#!/usr/bin/expect -f

# Set timeout
set timeout -1

# Enable output to stdout
log_user 1

# Start claude
spawn ${claudePath}

# Interactive mode - forward all input/output without extra processing
interact
`;
}

module.exports = {
  generateExpectScript,
};

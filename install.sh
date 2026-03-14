#!/bin/bash
# ============================================================
#  WPSafeFix — One-liner installer for macOS/Linux
#  WordPress Coding Standards & Plugin Review Auditor
#  by MD. AL-Shahreyar (https://github.com/Shahreyar46)
# ============================================================

REPO="https://github.com/Shahreyar46/wp-standards.git"
SKILL_NAME="wp-standards"
GLOBAL_DIR="$HOME/.claude/skills/$SKILL_NAME"

echo ""
echo " ======================================================="
echo "   WPSafeFix -- WordPress Auditor Skill"
echo "   Coding Standards & Plugin Review Toolkit"
echo "   by MD. AL-Shahreyar  *  github.com/Shahreyar46"
echo " ======================================================="
echo ""

# Check git
if ! command -v git &> /dev/null; then
    echo " [ERROR] git is not installed."
    exit 1
fi

# Ask install type
echo " Installing Globally to: $GLOBAL_DIR"
echo ""

# Install/Update
if [ -d "$GLOBAL_DIR" ]; then
    echo " Existing install found. Updating..."
    cd "$GLOBAL_DIR" && git pull origin master
else
    mkdir -p "$(dirname "$GLOBAL_DIR")"
    echo " Cloning from GitHub..."
    git clone --depth=1 "$REPO" "$GLOBAL_DIR"
fi

# Deploy to other AI tools
echo ""
echo " Deploying to other AI tool directories..."

DEPS=(
    "$HOME/.gemini/antigravity/skills/$SKILL_NAME"
    "$HOME/.codex/skills/$SKILL_NAME"
    "$HOME/.cursor/skills/$SKILL_NAME"
    "$HOME/.antigravity/skills/$SKILL_NAME"
    "$HOME/.cagent/skills/$SKILL_NAME"
    "$HOME/.kiro/skills/$SKILL_NAME"
)

for dir in "${DEPS[@]}"; do
    mkdir -p "$(dirname "$dir")"
    rm -rf "$dir"
    cp -R "$GLOBAL_DIR" "$dir"
    echo " [OK] Deployed to $dir"
done

echo ""
echo " ======================================================="
echo "   Installation Complete!"
echo " ======================================================="
echo ""
echo " Restart your AI tool, then use the skill."
echo ""

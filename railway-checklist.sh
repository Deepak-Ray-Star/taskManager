#!/bin/bash

# Railway Pre-Deployment Checklist
# Run this script to verify your project is ready for Railway deployment

echo "=== Railway Deployment Checklist ==="
echo ""

# Check Node.js
echo "✓ Checking Node.js version..."
if command -v node &> /dev/null; then
    echo "  Node.js $(node --version) installed"
else
    echo "  ✗ Node.js not found"
fi

echo ""
echo "✓ Checking project structure..."

# Backend checks
if [ -d "backend" ]; then
    echo "  ✓ Backend directory found"
    if [ -f "backend/package.json" ]; then
        echo "    ✓ backend/package.json exists"
    fi
    if [ -f "backend/src/server.js" ]; then
        echo "    ✓ backend/src/server.js exists"
    fi
    if [ -f "backend/Procfile" ]; then
        echo "    ✓ backend/Procfile exists"
    else
        echo "    ✗ backend/Procfile missing (create it)"
    fi
    if [ -f "backend/nixpacks.toml" ]; then
        echo "    ✓ backend/nixpacks.toml exists"
    else
        echo "    ✗ backend/nixpacks.toml missing (create it)"
    fi
else
    echo "  ✗ Backend directory not found"
fi

echo ""

# Frontend checks
if [ -d "frontend" ]; then
    echo "  ✓ Frontend directory found"
    if [ -f "frontend/package.json" ]; then
        echo "    ✓ frontend/package.json exists"
    fi
    if [ -f "frontend/vite.config.js" ]; then
        echo "    ✓ frontend/vite.config.js exists"
    fi
    if [ -f "frontend/nixpacks.toml" ]; then
        echo "    ✓ frontend/nixpacks.toml exists"
    else
        echo "    ✗ frontend/nixpacks.toml missing (create it)"
    fi
else
    echo "  ✗ Frontend directory not found"
fi

echo ""
echo "✓ Dependencies check..."

# Check backend dependencies
if [ -f "backend/package.json" ]; then
    if grep -q '"express"' backend/package.json; then
        echo "    ✓ Express found in backend"
    fi
    if grep -q '"mongoose"' backend/package.json; then
        echo "    ✓ Mongoose found in backend"
    fi
fi

# Check frontend dependencies
if [ -f "frontend/package.json" ]; then
    if grep -q '"react"' frontend/package.json; then
        echo "    ✓ React found in frontend"
    fi
    if grep -q '"vite"' frontend/package.json; then
        echo "    ✓ Vite found in frontend"
    fi
fi

echo ""
echo "=== Checklist Complete ==="
echo ""
echo "Next steps:"
echo "1. Create any missing files from checklist above"
echo "2. Commit changes to GitHub: git add . && git commit -m 'Add Railway config'"
echo "3. Push to GitHub: git push origin main"
echo "4. Go to railway.app and create new project"
echo "5. Connect your GitHub repository"
echo "6. Add Backend, MongoDB, and Frontend services"
echo "7. Configure environment variables for each service"
echo "8. Deploy and monitor"

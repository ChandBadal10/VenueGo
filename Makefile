# ─────────────────────────────────────────
#  VenueGo — Smart Sports Venue Booking Platform
#  Usage: make <command>
#  Place this file in the root VENUEGO folder
# ─────────────────────────────────────────

FRONTEND_DIR = client
BACKEND_DIR  = server

.PHONY: install install-client install-server \
        dev dev-client dev-server \
        build start clean help


# ── Install ───────────────────────────────

# Install dependencies for both client and server
install: install-client install-server
	@echo "✅ All dependencies installed"

install-client:
	@echo "📦 Installing client dependencies..."
	cd $(FRONTEND_DIR) && npm install

install-server:
	@echo "📦 Installing server dependencies..."
	cd $(BACKEND_DIR) && npm install


# ── Development ───────────────────────────

# Run client and server in parallel (both in the background)
dev:
	@echo "🚀 Starting VenueGo (client + server)..."
	@make dev-server & make dev-client

# Run only the React (Vite) client
dev-client:
	@echo "🎨 Starting client on http://localhost:5173 ..."
	cd $(FRONTEND_DIR) && npm run dev

# Run only the Express server
dev-server:
	@echo "⚙️  Starting server on http://localhost:3000 ..."
	cd $(BACKEND_DIR) && npm run server


# ── Build ─────────────────────────────────

# Build the React app for production (output: client/dist)
build:
	@echo "🏗️  Building client for production..."
	cd $(FRONTEND_DIR) && npm run build
	@echo "✅ Build complete → $(FRONTEND_DIR)/dist"


# ── Production Start ──────────────────────

# Start the Express server in production mode
start:
	@echo "🟢 Starting server in production mode..."
	cd $(BACKEND_DIR) && npm start


# ── Clean ─────────────────────────────────

# Remove all node_modules and build artifacts
clean:
	@echo "🧹 Cleaning project..."
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/dist
	rm -rf $(BACKEND_DIR)/node_modules
	@echo "✅ Clean complete"


# ── Help ──────────────────────────────────

help:
	@echo ""
	@echo "  VenueGo — Smart Sports Venue Booking Platform"
	@echo "  ─────────────────────────────────────────────"
	@echo ""
	@echo "  make install          Install client + server dependencies"
	@echo "  make install-client   Install only client dependencies"
	@echo "  make install-server   Install only server dependencies"
	@echo ""
	@echo "  make dev              Run client + server together"
	@echo "  make dev-client       Run only React client  (port 5173)"
	@echo "  make dev-server       Run only Express server (port 3000)"
	@echo ""
	@echo "  make build            Build React app for production"
	@echo "  make start            Start server in production mode"
	@echo ""
	@echo "  make clean            Remove node_modules + dist"
	@echo ""
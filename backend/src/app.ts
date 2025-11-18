// backend/src/app.ts
import Fastify from "fastify";
import healthRoutes from "./routes/health.route.js"; 
import documentRoutes from "./routes/document.route.js";

export const buildApp = () => {
  const app = Fastify({
    logger: true, // keep this on for debugging; disable only in prod if needed
  });

  // Register routes
  app.register(healthRoutes, { prefix: "/health" });
  app.register(documentRoutes,{prefix:"/documents"});

  return app;
};

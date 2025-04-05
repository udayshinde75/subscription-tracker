import aj from "../config/arcjet.js";
import { ARCJET_ENV } from "../config/env.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    //console.log("Arcjet Decision:", decision);
    // if (decision.isDenied) {
    //   if (decision.reason.isRateLimit()) {
    //     return res.status(429).json({ message: "Too many requests" });
    //   }
    //   if (decision.reason.isBot?.()) {
    //     return res.status(403).json({ message: "Bot detected" });
    //   }

    //   return res.status(403).json({ message: "Access denied" });
    // }
    if (decision.conclusion === "DENY") {
      if (decision.reason?.isRateLimit?.()) {
        return res.status(429).json({ message: "Too many requests" });
      }
      if (decision.reason?.isBot?.()) {
        return res.status(403).json({ message: "Bot detected" });
      }
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    console.log(`Arcjet Middleware Error: ${err}`);
    next(err);
  }
};

export default arcjetMiddleware;

import jwt from "jsonwebtoken"
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({
            success: false,
            code: 404,
            message: "Token is required",
            data: "",
            error: true
        })
    }

    const rawToken = authHeader.split(" ");
    const token = rawToken[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.json({
                success: false,
                code: 400,
                message: "Invalid or token expired",
                data: "",
                error: true
            })
        } else {
            req.user = decode;
            next();
        }
    })
}
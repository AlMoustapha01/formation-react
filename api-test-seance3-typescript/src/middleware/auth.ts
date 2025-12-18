import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest, TokenPayload, ErrorCodes } from '../types';

/**
 * Middleware pour vérifier le token JWT
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: 'Token manquant',
      code: ErrorCodes.NO_TOKEN,
    });
    return;
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          error: 'Token expiré',
          code: ErrorCodes.TOKEN_EXPIRED,
        });
        return;
      }
      res.status(403).json({
        error: 'Token invalide',
        code: ErrorCodes.INVALID_TOKEN,
      });
      return;
    }

    req.user = decoded as TokenPayload;
    next();
  });
}

/**
 * Middleware optionnel - n'échoue pas si pas de token
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (!err) {
        req.user = decoded as TokenPayload;
      }
    });
  }

  next();
}

/**
 * Middleware pour vérifier le rôle admin
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      error: 'Accès réservé aux administrateurs',
      code: 'FORBIDDEN',
    });
    return;
  }
  next();
}

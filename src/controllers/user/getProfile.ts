import { Response } from "express";
import { User, Role } from "../../models";
import { IUser } from "../../interfaces/user.interface";
import { AuthRequest } from "../../interfaces/auth.interface";
import {
  sendBadRequest,
  sendSuccessResponse,
  sendInternalErrorResponse,
} from "../../utils/commons/responseFunctions";
import { ERROR_MESSAGES } from "../../utils/constants/messages/error.messages";
import { SUCCESS_MESSAGES } from "../../utils/constants/messages/success.messages";

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id; // Usuario ya autenticado por middleware

    // Buscar el usuario con información completa del rol
    const user = (await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "description", "permissions", "isActive"],
        },
      ],
      attributes: {
        exclude: ["password", "passwordResetToken", "passwordResetExpires"],
      },
    })) as IUser | null;

    // Verificar que el usuario exista (por si fue eliminado después del login)
    if (!user) {
      sendBadRequest(res, ERROR_MESSAGES.USER.USER_NOT_FOUND, "404");
      return;
    }

    // Verificar que el usuario siga activo
    if (!user.isActive) {
      sendBadRequest(res, ERROR_MESSAGES.AUTH.USER_INACTIVE, "401");
      return;
    }

    // Preparar datos de respuesta
    const profileData = {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      corporative_email: user.corporative_email,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      role: {
        id: user.role?.id,
        name: user.role?.name,
        description: user.role?.description,
        permissions: user.role?.permissions,
        isActive: user.role?.isActive,
      },
      account: {
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        memberSince: calculateMemberSince(user.createdAt),
      },
    };

    sendSuccessResponse(
      res,
      SUCCESS_MESSAGES.USER.PROFILE_RETRIEVED,
      "200",
      profileData,
    );
  } catch (error) {
    console.error("Error en getProfile:", error);
    sendInternalErrorResponse(res);
  }
};

// Función helper para calcular tiempo como miembro
function calculateMemberSince(createdAt: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} días`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "mes" : "meses"}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? "año" : "años"}`;
    }
    return `${years} ${years === 1 ? "año" : "años"} y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`;
  }
}

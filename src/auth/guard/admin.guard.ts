import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';

/**
 * Only admin guard
 *
 * @description
 * This guard is used to protect endpoints that requires user to be an admin.
 * It checks if user is authenticated and if it has the required admin level.
 */
@Injectable()
export class OnlyAdminGuard implements CanActivate {
	/**
	 * Constructor
	 *
	 * @param {Reflector} reflector - Reflector instance
	 */
	constructor(private reflector: Reflector) {}

	/**
	 * Check if user can activate the route
	 *
	 * @param {ExecutionContext} context - Execution context
	 * @returns {boolean} - True if user can activate the route
	 */
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: User }>();
		const user = request.user;

		const requiredAdminLevel = this.reflector.get<string>('adminLevel', context.getHandler());

		if (!user || user.role === 'user') {
			throw new ForbiddenException('You have no rights!');
		}

		if (requiredAdminLevel && !this.hasRequiredRole(user.role, requiredAdminLevel)) {
			throw new ForbiddenException('You have no rights!');
		}

		return true;
	}

	/**
	 * Check if user role is equal or higher than required role
	 *
	 * @param {string} userRole - User role
	 * @param {string} requiredAdminLevel - Required admin level
	 * @returns {boolean} - True if user role is equal or higher than required role
	 */
	private hasRequiredRole(userRole: string, requiredAdminLevel: string): boolean {
		const roleHierarchy = ['user', 'admin-level-one', 'admin-level-two'];
		const userRoleIndex = roleHierarchy.indexOf(userRole);
		const requiredRoleIndex = roleHierarchy.indexOf(requiredAdminLevel);

		return userRoleIndex >= requiredRoleIndex;
	}
}


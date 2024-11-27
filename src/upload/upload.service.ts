import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Service for managing file uploads
 *
 * @description
 * Service that handles file uploads
 */
@Injectable()
export class UploadService {

	/**
	 * Handles a file upload
	 *
	 * @param {Express.Multer.File} file - The file to be saved
	 * @returns {Promise<{
	 *   originalname: string,
	 *   filename: string,
	 *   path: string,
	 *   size: number,
	 *   mimetype: string
	 * }>} - The uploaded file information
	 */
	handleFile(file: Express.Multer.File) {
		const directoryPath = path.dirname(file.path)
		console.log(file)
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath, { recursive: true })
		}

		return {
			originalname: file.originalname,
			filename: file.filename,
			path: file.path,
			size: file.size,
			mimetype: file.mimetype
		}
	}
}


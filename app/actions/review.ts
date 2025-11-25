"use server";

import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export type CreateReviewInput = {
	placeId: number;
	userId: string; // Simulasi user ID (misal nama user)
	userName: string; // Add userName
	avatar: string;
	content: string;
	rating: number;
	visitCount: number;
	date: Date;
	images?: string[];
};

export type UpdateReviewInput = {id: number; content?: string; rating?: number; visitCount?: number};

/**
 * Create a new review
 */
export async function createReview(input: CreateReviewInput) {
	try {
		const review = await prisma.review.create({
			data: {
				place: {connect: {id: input.placeId}},
				userId: input.userId,
				userName: input.userName,
				avatar: input.avatar,
				content: input.content,
				rating: input.rating,
				visitCount: input.visitCount,
				date: input.date,
				images: input.images || [],
			},
		});

		revalidatePath("/");
		revalidatePath(`/detail/${input.placeId}`);

		return {success: true, data: review};
	} catch (error) {
		console.error("Error creating review:", error);
		return {success: false, error: "Gagal menambahkan ulasan"};
	}
}

/**
 * Update a review
 */
export async function updateReview(input: UpdateReviewInput) {
	try {
		const review = await prisma.review.update({
			where: {id: input.id},
			data: {content: input.content, rating: input.rating, visitCount: input.visitCount},
		});

		revalidatePath("/");
		if (review.placeId) {
			revalidatePath(`/detail/${review.placeId}`);
		}

		return {success: true, data: review};
	} catch (error) {
		console.error("Error updating review:", error);
		return {success: false, error: "Gagal memperbarui ulasan"};
	}
}

/**
 * Delete a review
 */
export async function deleteReview(id: number) {
	try {
		const review = await prisma.review.delete({where: {id}});

		revalidatePath("/");
		if (review.placeId) {
			revalidatePath(`/detail/${review.placeId}`);
		}

		return {success: true, message: "Ulasan berhasil dihapus"};
	} catch (error) {
		console.error("Error deleting review:", error);
		return {success: false, error: "Gagal menghapus ulasan"};
	}
}

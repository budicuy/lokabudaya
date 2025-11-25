/**
 * Testing Script untuk Place CRUD Server Actions
 *
 * Cara menggunakan:
 * 1. Buat file test di app atau jalankan di server component
 * 2. Import dan panggil function yang ingin di-test
 * 3. Check hasil di console
 */

import {
	getAllPlaces,
	getPlaceById,
	createPlace,
	updatePlace,
	deletePlace,
	searchPlaces,
	getPlacesByCategory,
	incrementVisitorCount,
} from "@/app/actions/place";
import {Category} from "@/prisma/generated/client";

export async function testGetAllPlaces() {
	console.log("Testing: getAllPlaces");
	const result = await getAllPlaces();
	console.log("Result:", result);
	return result;
}

export async function testGetPlaceById(id: number) {
	console.log(`Testing: getPlaceById(${id})`);
	const result = await getPlaceById(id);
	console.log("Result:", result);
	return result;
}

export async function testCreatePlace() {
	console.log("Testing: createPlace");
	const result = await createPlace({
		name: "Test Place",
		category: Category.Bangunan,
		location: "Test Location",
		description: "This is a test place created by testing script",
		visitors: 100,
		image: "https://via.placeholder.com/400",
		longitude: 106.8456,
		latitude: -6.2088,
	});
	console.log("Result:", result);
	return result;
}

export async function testUpdatePlace(id: number) {
	console.log(`Testing: updatePlace(${id})`);
	const result = await updatePlace({id, name: "Updated Test Place", visitors: 200});
	console.log("Result:", result);
	return result;
}

export async function testDeletePlace(id: number) {
	console.log(`Testing: deletePlace(${id})`);
	const result = await deletePlace(id);
	console.log("Result:", result);
	return result;
}

export async function testSearchPlaces(query: string) {
	console.log(`Testing: searchPlaces("${query}")`);
	const result = await searchPlaces(query);
	console.log("Result:", result);
	return result;
}

export async function testGetPlacesByCategory(category: Category) {
	console.log(`Testing: getPlacesByCategory(${category})`);
	const result = await getPlacesByCategory(category);
	console.log("Result:", result);
	return result;
}

export async function testIncrementVisitorCount(id: number) {
	console.log(`Testing: incrementVisitorCount(${id})`);
	const result = await incrementVisitorCount(id);
	console.log("Result:", result);
	return result;
}

/**
 * Run all tests in sequence
 */
export async function runAllTests() {
	console.log("========== Starting CRUD Tests ==========");

	// Test 1: Get all places
	await testGetAllPlaces();

	// Test 2: Create new place
	const createResult = await testCreatePlace();
	const newPlaceId = createResult.success ? createResult.data?.id : null;

	if (newPlaceId) {
		// Test 3: Get place by ID
		await testGetPlaceById(newPlaceId);

		// Test 4: Update place
		await testUpdatePlace(newPlaceId);

		// Test 5: Increment visitor count
		await testIncrementVisitorCount(newPlaceId);

		// Test 6: Delete place
		await testDeletePlace(newPlaceId);
	}

	// Test 7: Search places
	await testSearchPlaces("Candi");

	// Test 8: Get places by category
	await testGetPlacesByCategory(Category.Bangunan);

	console.log("========== Tests Completed ==========");
}

/**
 * Contoh penggunaan di server component:
 *
 * import { runAllTests } from "@/tests/place-crud.test";
 *
 * export default async function TestPage() {
 *   await runAllTests();
 *   return <div>Check console for results</div>;
 * }
 */

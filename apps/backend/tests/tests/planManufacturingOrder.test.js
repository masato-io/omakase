import { context } from "@tailor-platform/api-test-library";

/**
 * Test for successful planning of a Manufacturing Order
 * Ensures that the pipeline correctly plans the MO and updates the work orders' dates
 */
test("1. Successful Planning of Manufacturing Order", async () => {
    const manufacturingOrderId = context.env.ManufacturingOrder.manufacturingorder1.id;
    const scheduleDateTime =`${new Date().toISOString()}`;

    console.log("Input Values:", { manufacturingOrderId, scheduleDateTime });

    try {
        // Run the pipeline to plan the manufacturing order
        const result = await context.runPipeline("planManufacturingOrder", {
            input: { manufacturingOrderId, scheduleDateTime }
        });

        console.log("Pipeline Result:", result);

        // Validate that the result indicates success
        expect(result.success).toBe(true);

        console.info("Manufacturing order planned successfully:", result);
    } catch (error) {
        console.error("Error running pipeline:", error);
        throw error; // Re-throw the error to fail the test
    }
}, 60000);


/**
 * Test for handling non-existent Manufacturing Order ID
 * Verifies that an error is thrown for an invalid MO ID
 */
test("2. Handling Non-Existent Manufacturing Order ID", async () => {
    const manufacturingOrderId = context.env.Uom.uom2.id;
    const scheduleDateTime = `${new Date().toISOString()}`;

    console.log("Input Values:", { manufacturingOrderId, scheduleDateTime });

    try {
        // Attempt to run the pipeline with an invalid MO ID
        await context.runPipeline("planManufacturingOrder", {
            input: { manufacturingOrderId, scheduleDateTime }
        });

        // If no error is thrown, fail the test
        fail("Expected an error to be thrown for non-existent Manufacturing Order ID");
    } catch (error) {
        // Validate that the error message is as expected
        expect(error.message).toContain(`No manufacturing order found for the given ID: ${manufacturingOrderId}`);
        console.info("Error handling works as expected:", error.message);
    }
}, 60000);
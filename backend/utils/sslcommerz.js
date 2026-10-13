import SSLCommerzPayment from "sslcommerz-lts";

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASSWORD;
const is_live = process.env.SSLCZ_IS_LIVE === "true";

export async function createPaymentSession(appointment, patient) {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    const data = {
        total_amount: appointment.consultation_fee,
        currency: "BDT",
        tran_id: appointment._id.toString(),
        success_url: `${process.env.SERVER_URL}/api/payments/success`,
        fail_url: `${process.env.SERVER_URL}/api/payments/fail`,
        cancel_url: `${process.env.SERVER_URL}/api/payments/cancel`,
        ipn_url: `${process.env.SERVER_URL}/api/payments/ipn`,
        shipping_method: "NO",
        product_name: `Consultation with ${appointment.doctorName || "Doctor"}`,
        product_category: "Healthcare",
        product_profile: "general",
        cus_name: patient.name,
        cus_email: patient.email,
        cus_add1: patient.address || "N/A",
        cus_city: patient.city || "Dhaka",
        cus_postcode: patient.postcode || "1200",
        cus_country: patient.country || "Bangladesh",
        cus_phone: patient.phone || "01700000000",
        ship_name: "N/A",
        ship_add1: "N/A",
        ship_city: "N/A",
        ship_postcode: "1200",
        ship_country: "N/A",
    };

    const apiResponse = await sslcz.init(data);

    if (!apiResponse?.GatewayPageURL) {
        console.error("SSLCommerz init failed — full response:", apiResponse);
        const reason = apiResponse?.failedreason || apiResponse?.status || "Unknown gateway error";
        throw new Error(`Payment session could not be created: ${reason}`);
    }

    return apiResponse.GatewayPageURL;
}

// Validates the val_id received from the success callback or IPN directly with SSLCommerz.
export async function validatePayment(val_id) {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });
    return validation;
}
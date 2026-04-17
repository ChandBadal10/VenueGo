import crypto from "crypto";

export const generateSignature = (req, res) => {
  try {
    const { total_amount, transaction_uuid, product_code } = req.body;

    // Validate all required fields are present
    if (!total_amount || !transaction_uuid || !product_code) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: total_amount, transaction_uuid, product_code",
      });
    }

    const secretKey = process.env.ESEWA_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        success: false,
        message: "eSewa secret key not configured",
      });
    }

    //  No spaces — exact format eSewa expects
    const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("base64");

    //  All zero-value fields sent as strings to avoid type issues
    return res.json({
      success: true,
      paymentUrl: process.env.ESEWA_PAYMENT_URL,
      paymentData: {
        amount: total_amount,
        tax_amount: "0",
        total_amount: total_amount,
        transaction_uuid: transaction_uuid,
        product_code: product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: process.env.SUCCESS_URL,
        failure_url: process.env.FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate payment signature",
    });
  }
};
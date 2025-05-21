import React, { useState, useEffect } from "react";
import md5 from "blueimp-md5"; // Importamos la librería

const PayUCheckout: React.FC = () => {
	// Estado de los valores del pago
	const [referenceCode] = useState("TestPayU_005"); // Código único por pago
	const [amount] = useState(100); // Monto en COP
	const [currency] = useState("COP");
	const [signature, setSignature] = useState("");

	// Credenciales de PayU Sandbox
	const API_KEY = "4Vj8eK4rloUd272L48hsrarnUA";
	const MERCHANT_ID = "508029";
	const ACCOUNT_ID = "512321";

	// Generar la firma MD5 cuando el componente se monte
	useEffect(() => {
		const generateSignature = () => {
			const signatureString = `${API_KEY}~${MERCHANT_ID}~${referenceCode}~${amount}~${currency}`;
			const hash = md5(signatureString); // Usamos md5 de blueimp-md5
			setSignature(hash);
		};

		generateSignature();
	}, [referenceCode, amount, currency]);

	return (
		<div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
			<h2 className="text-xl font-bold mb-4">Pagar con PayU</h2>
			<form
				method="post"
				action={import.meta.env.VITE_BACKEND_BASE_URL}
			>
				{/* Campos ocultos con la información de pago */}
				<input type="hidden" name="merchantId" value={MERCHANT_ID} />
				<input type="hidden" name="accountId" value={ACCOUNT_ID} />
				<input type="hidden" name="description" value="Pago de prueba con PayU" />
				<input type="hidden" name="referenceCode" value={referenceCode} />
				<input type="hidden" name="amount" value={amount} />
				<input type="hidden" name="currency" value={currency} />
				<input type="hidden" name="signature" value={signature} />
				<input type="hidden" name="test" value="1" />
				<input type="hidden" name="responseUrl" value={`${import.meta.env.VITE_BASE_URL}/payment-response`}  />
				<input type="hidden" name="confirmationUrl" value={`${import.meta.env.VITE_BACKEND_BASE_URL}/payu/confirm`} />

				{/* Botón para iniciar el pago */}
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
				>
					Ir a Pagar con PayU
				</button>
			</form>
		</div>
	);
};

export default PayUCheckout;

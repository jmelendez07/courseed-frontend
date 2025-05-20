import md5 from "blueimp-md5";
import React from "react";

const STORAGE_KEY = "selectedPlan";

interface PricingFeature {
    text: string;
}

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: "M" | "A";
    features: PricingFeature[];
    button: {
        text: string;
    };
}

function useSelectedPlan() {
    const [selectedPlan, setSelectedPlan] = React.useState<PricingPlan | null>(null);

    const savePlan = (plan: PricingPlan) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
        setSelectedPlan(plan);
    };

    React.useEffect(() => {
        const storedPlan = sessionStorage.getItem(STORAGE_KEY);
        if (storedPlan) {
            setSelectedPlan(JSON.parse(storedPlan));
        }
    }, []);

    const clearPlan = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSelectedPlan(null);
    };

    const redirectToPayU = (userId: string, newPlan?: PricingPlan) => {

        const plan: PricingPlan | null = newPlan ? newPlan : selectedPlan;

        if (!plan) return;

        const PAYU_URL = import.meta.env.VITE_PAYU_URL;
        const API_KEY = import.meta.env.VITE_PAYU_API_KEY;
        const MERCHANT_ID = import.meta.env.VITE_PAYU_MERCHANT_ID;
        const ACCOUNT_ID = import.meta.env.VITE_PAYU_ACCOUNT_ID;

        const referenceCode = `PAYU_${userId}_${plan.id}_${plan.duration}_${Date.now()}`;
        const signature = md5(`${API_KEY}~${MERCHANT_ID}~${referenceCode}~${plan.price.toFixed(2)}~${plan.currency}`);
        
        const form = document.createElement("form");
        form.method = "POST";
        form.action = PAYU_URL;

        const fields = {
            merchantId: MERCHANT_ID,
            accountId: ACCOUNT_ID,
            description: "Pago de suscripción",
            referenceCode,
            amount: plan.price,
            currency: plan.currency,
            signature,
            test: "1",
            responseUrl: `${import.meta.env.VITE_BASE_URL}/suscriptor`,
            confirmationUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}/subscriptions/confirm?secret=${API_KEY}`,
        };

        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value.toString();
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        clearPlan();
    };


    return { selectedPlan, savePlan, clearPlan, redirectToPayU };
}

export default useSelectedPlan;
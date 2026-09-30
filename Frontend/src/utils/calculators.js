export const calculateEMI = (
    principal,
    annualRate,
    months
) => {

    const monthlyRate =
        annualRate / 12 / 100;

    const emi =
        principal *
        monthlyRate *
        Math.pow(
            1 + monthlyRate,
            months
        ) /
        (
            Math.pow(
                1 + monthlyRate,
                months
            ) - 1
        );

    return emi.toFixed(2);
};

export const totalRepayment = (
    emi,
    months
) => {

    return (
        parseFloat(emi) *
        parseInt(months)
    ).toFixed(2);
};

export const totalInterest = (
    principal,
    total
) => {

    return (
        parseFloat(total) -
        parseFloat(principal)
    ).toFixed(2);
};

/* ==========================
   INVESTMENT CALCULATOR
========================== */

export const calculateInvestment = (
    principal,
    rate,
    years
) => {

    const maturity =
        principal *
        Math.pow(
            1 + (rate / 100),
            years
        );

    return maturity.toFixed(2);
};

export const calculateProfit = (
    principal,
    maturity
) => {

    return (
        parseFloat(maturity) -
        parseFloat(principal)
    ).toFixed(2);
};
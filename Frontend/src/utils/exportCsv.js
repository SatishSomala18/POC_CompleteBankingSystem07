export const exportTransactions = (
    transactions
) => {

    let csv =
        "Transaction ID,Amount,Type\n";

    transactions.forEach(tx => {

        csv +=
            `${tx.transactionId},${tx.amount},${tx.transactionType}\n`;

    });

    const blob =
        new Blob(
            [csv],
            {
                type:
                "text/csv;charset=utf-8;"
            }
        );

    const url =
        window.URL.createObjectURL(
            blob
        );

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "transactions.csv";

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );
};
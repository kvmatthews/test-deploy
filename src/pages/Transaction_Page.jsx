import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import hooks dari Redux
import { fetchTransactions, incrementOffset, resetTransactions } from "../redux/transactionSlice"; // Import actions

const TransactionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { transactions, offset, limit, loading, error } = useSelector((state) => state.transaction); // Ambil state dari Redux
    const jwtToken = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (!jwtToken) {
            navigate("/");
        } else {
            dispatch(resetTransactions()); // Reset transaksi saat pertama kali load halaman
            dispatch(fetchTransactions({ offset: 0, limit, token: jwtToken })); // Fetch transaksi
        }
    }, [dispatch, jwtToken, navigate, limit]);

    const handleShowMore = () => {
        dispatch(incrementOffset());
        dispatch(fetchTransactions({ offset: offset + limit, limit, token: jwtToken })); // Fetch transaksi berikutnya
    };

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta',
            timeZoneName: 'short'
        };

        const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
        const formattedTime = date.toLocaleTimeString('id-ID', optionsTime);

        return `${formattedDate} ${formattedTime}`;
    };

    // Format Currency
    const formatCurrency = (amount, transactionType) => {
        const formattedAmount = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('IDR', 'RP').replace(/\s/g, '.');

        if (transactionType === 'TOPUP') {
            return `+ ${formattedAmount}`;
        } else if (transactionType === 'PAYMENT') {
            return `- ${formattedAmount}`;
        }
        return formattedAmount;
    };

    return (
        <div className="halaman_transaksi">
            <h3>Semua Transaksi</h3>

            {error && <p className="error">{error}</p>}

            {transactions.length > 0 ? (
                <div className="transaction_list">
                    {transactions.map((transaction, index) => (
                        <div key={index} className="transaction_item">
                            <div className="information_transaction">
                                <p>
                                    <span
                                        data-transaction-type={transaction.transaction_type}
                                    >
                                        {formatCurrency(transaction.total_amount, transaction.transaction_type)}
                                    </span>
                                </p>
                                <p className="format_date">
                                    {formatDate(transaction.created_on)}
                                </p>
                            </div>
                            <p className="transaction_description">
                                {transaction.description}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p>Transaksi tidak ditemukan.</p>
            )}

            {!loading && transactions.length >= limit && (
                <button className="show_more" onClick={handleShowMore}>
                    Show More
                </button>
            )}
        </div>
    );
};

export default TransactionPage;

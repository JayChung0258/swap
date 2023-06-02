import React, { useState } from 'react';

const OtherPage = () => {
    const [data, setData] = useState(null);
    const [contractAddress, setContractAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    function getDate() {
        fetch('http://localhost:3001/firebase/get')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.log(error));
    }

    function postDate() {
        const postData = {
            contractAddress,
            tokenId,
            walletAddress,
        };

        fetch('http://localhost:3001/firebase/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then((response) => response.text())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        setSearchTerm(''); // 清空搜尋關鍵字
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>公佈欄</h1>
            <button style={styles.button} onClick={getDate}>
                查看交換資訊
            </button>

            {/* 顯示資料 */}
            {data && (
                <div>
                    <h2>資料：</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableRow}>
                                <th style={styles.tableHeader}>collections/contract Address</th>
                                <th style={styles.tableHeader}>token Id</th>
                                <th style={styles.tableHeader}>wallet Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data).map(([key, item]) => (
                                <tr key={key} style={styles.tableRow}>
                                    <td style={styles.tableData}>{item.contractAddress}</td>
                                    <td style={styles.tableData}>{item.tokenId}</td>
                                    <td style={styles.tableData}>{item.walletAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={styles.inputContainer}>
                <label htmlFor="contractAddress" style={styles.label}>
                    contract Address:
                </label>
                <input
                    type="text"
                    id="contractAddress"
                    style={styles.input}
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </div>

            <div style={styles.inputContainer}>
                <label htmlFor="tokenId" style={styles.label}>
                    token Id:
                </label>
                <input
                    type="text"
                    id="tokenId"
                    style={styles.input}
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                />
            </div>

            <div style={styles.inputContainer}>
                <label htmlFor="walletAddress" style={styles.label}>
                    wallet Address:
                </label>
                <input
                    type="text"
                    id="walletAddress"
                    style={styles.input}
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                />
            </div>

            <button style={styles.button} onClick={postDate}>
                輸入資料
            </button>
        </div>



    );

};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        marginBottom: '10px',
        cursor: 'pointer',
    },
    inputContainer: {
        marginBottom: '10px',
    },
    label: {
        marginRight: '10px',
    },
    input: {
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '200px',
    },
    table: {
        borderCollapse: 'collapse',
        width: '100%',
    },
    tableRow: {
        borderBottom: '1px solid #ccc',
    },
    tableHeader: {
        backgroundColor: '#000000',
        padding: '8px',
        fontWeight: 'bold',
    },
    tableData: {
        padding: '8px',
    },
};

export default OtherPage;

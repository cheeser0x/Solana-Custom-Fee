const {
    Keypair,
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    ComputeBudgetProgram,
} = require('@solana/web3.js');



async function main() {
    // Replace with your custom RPC URL and desired amount of SOL to send
    const clusterUrl = 'https://api.testnet.solana.com'; // Example mainnet URL
    const amountInSol = 0.1; // Amount of SOL to send
    const recipientAddress = 'PUBKEY'; // Replace with the recipient's public key
    
    const connection = new Connection(clusterUrl, 'confirmed');
  
    // Sender's keypair (Replace with actual sender's private key)
    const fromKeypair = Keypair.fromSecretKey(Uint8Array.from([
        // ... Your private key numbers here ...

    ]));

    //PRIORITY FEE COSTS
    // 0.000005 SOL = 1 mL
    // 0.0001 SOL = 5m mL
    // 0.05 SOL = 250m mL
    // 0.1 SOL = 500m mL
    // 0.2 SOL = 1000m mL
    // Set priority fee parameters
    const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 250000000, // Replace with your desired micro-lamports value
    });
  
    const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200000, // Replace with your desired compute unit limit
    });
  
    // Create transfer instruction
    const transferIx = SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(recipientAddress),
      lamports: amountInSol * LAMPORTS_PER_SOL,
    });
  
    // Create transaction with priority fees
    const transaction = new Transaction().add(computePriceIx, computeLimitIx, transferIx);
  
    // Fetch recent blockhash and sign transaction
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.sign(fromKeypair);
  
    // Send transaction
    try {
      const txid = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
      console.log('Transaction sent successfully with signature:', txid);
    } catch (e) {
      console.error('Failed to send transaction:', e);
    }
}

main().catch(console.error);

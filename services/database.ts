// import * as SQLite from "expo-sqlite"

// const db: SQLite.WebSQLDatabase = SQLite.openDatabase("watermate.db");

// // Initialize database tables
// export const initializeDatabase = () => {
//   return new Promise<void>((resolve, reject) => {
//     db.transaction(
//       (tx: SQLite.SQLTransaction) => {
//         // Users table
//         tx.executeSql(`
//           CREATE TABLE IF NOT EXISTS users (
//             id TEXT PRIMARY KEY,
//             name TEXT NOT NULL,
//             phone_number TEXT UNIQUE NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//             updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//           );
//         `);

//         // Orders table
//         tx.executeSql(`
//           CREATE TABLE IF NOT EXISTS orders (
//             id TEXT PRIMARY KEY,
//             user_id TEXT NOT NULL,
//             quantity INTEGER NOT NULL,
//             delivery_address TEXT NOT NULL,
//             payment_method TEXT NOT NULL,
//             status TEXT NOT NULL,
//             total_amount REAL NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//             delivered_at DATETIME,
//             rating INTEGER,
//             review TEXT,
//             synced BOOLEAN DEFAULT 0,
//             FOREIGN KEY (user_id) REFERENCES users (id)
//           );
//         `);

//         // Sync queue table
//         tx.executeSql(`
//           CREATE TABLE IF NOT EXISTS sync_queue (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             table_name TEXT NOT NULL,
//             record_id TEXT NOT NULL,
//             action TEXT NOT NULL,
//             data TEXT NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//             synced BOOLEAN DEFAULT 0
//           );
//         `);

//         // Payment transactions table
//         tx.executeSql(`
//           CREATE TABLE IF NOT EXISTS payment_transactions (
//             id TEXT PRIMARY KEY,
//             order_id TEXT NOT NULL,
//             checkout_request_id TEXT,
//             phone_number TEXT NOT NULL,
//             amount REAL NOT NULL,
//             status TEXT NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (order_id) REFERENCES orders (id)
//           );
//         `);
//       },
//       (error: any) => reject(error),
//       () => resolve()
//     );
//   })
// }

// // Database operations
// export const dbOperations = {
//   // Insert order
//   insertOrder: (order: any): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       db.transaction(
//         (tx: SQLite.SQLTransaction) => {
//           tx.executeSql(
//             `INSERT INTO orders (id, user_id, quantity, delivery_address, payment_method, status, total_amount, created_at)
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//               order.id,
//               order.userId,
//               order.quantity,
//               JSON.stringify(order.deliveryAddress),
//               order.paymentMethod,
//               order.status,
//               order.totalAmount,
//               order.createdAt.toISOString(),
//             ],
//           )
//         },
//         (error) => reject(error),
//         () => resolve(),
//       )
//     })
//   },

//   // Get orders for user
//   getOrdersForUser: (userId: string): Promise<any[]> => {
//     return new Promise((resolve, reject) => {
//       db.transaction((tx) => {
//         tx.executeSql(
//           "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
//           [userId],
//           (_, { rows }) => {
//             const orders = []
//             for (let i = 0; i < rows.length; i++) {
//               const row = rows.item(i)
//               orders.push({
//                 ...row,
//                 deliveryAddress: JSON.parse(row.delivery_address),
//                 createdAt: new Date(row.created_at),
//                 deliveredAt: row.delivered_at ? new Date(row.delivered_at) : null,
//               })
//             }
//             resolve(orders)
//           },
//           (_, error) => reject(error),
//         )
//       })
//     })
//   },

//   // Update order status
//   updateOrderStatus: (orderId: string, status: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       db.transaction(
//         (tx) => {
//           tx.executeSql("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, orderId])
//         },
//         (error) => reject(error),
//         () => resolve(),
//       )
//     })
//   },

//   // Add to sync queue
//   addToSyncQueue: (tableName: string, recordId: string, action: string, data: any): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       db.transaction(
//         (tx) => {
//           tx.executeSql("INSERT INTO sync_queue (table_name, record_id, action, data) VALUES (?, ?, ?, ?)", [
//             tableName,
//             recordId,
//             action,
//             JSON.stringify(data),
//           ])
//         },
//         (error) => reject(error),
//         () => resolve(),
//       )
//     })
//   },

//   // Get unsynced items
//   getUnsyncedItems: (): Promise<any[]> => {
//     return new Promise((resolve, reject) => {
//       db.transaction((tx) => {
//         tx.executeSql(
//           "SELECT * FROM sync_queue WHERE synced = 0 ORDER BY created_at ASC",
//           [],
//           (_, { rows }) => {
//             const items = []
//             for (let i = 0; i < rows.length; i++) {
//               items.push(rows.item(i))
//             }
//             resolve(items)
//           },
//           (_, error) => reject(error),
//         )
//       })
//     })
//   },

//   // Mark item as synced
//   markItemSynced: (id: number): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       db.transaction(
//         (tx) => {
//           tx.executeSql("UPDATE sync_queue SET synced = 1 WHERE id = ?", [id])
//         },
//         (error) => reject(error),
//         () => resolve(),
//       )
//     })
//   },
// }

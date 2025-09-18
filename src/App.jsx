import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, getDocs, getDoc } from 'firebase/firestore';
import AuthPage from './AuthPage';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [newGroceryItem, setNewGroceryItem] = useState('');
  const [toDoItems, setToDoItems] = useState([]);
  const [newToDoItem, setNewToDoItem] = useState('');
  const [listType, setListType] = useState('groceryList');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        setUser(null);
        setGroceryItems([]);
        setToDoItems([]);
      }
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!user) return;
    const userListCollection = collection(db, "users", user.uid, listType);

    const unsubscribe = onSnapshot(userListCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (listType === 'groceryList') {
        setGroceryItems(items);
      } else {
        setToDoItems(items);
      }
    });

    return () => unsubscribe();
  }, [listType, user]);
  useEffect(() => {
    if (!user) return;

    async function testRead() {
      try {
        const userListCollection = collection(db, "users", user.uid, listType);
        const snapshot = await getDocs(userListCollection);
        console.log('Test read success:', snapshot.docs.map(doc => doc.data()));
      } catch (err) {
        console.error('Test read error:', err);
      }
    }
    testRead();
  }, [listType, user]);

  if (!user) { return <AuthPage /> }

  const addItem = async (e) => {
    e.preventDefault();
    if (listType === 'groceryList' && newGroceryItem.trim() === '') return;
    if (listType === 'toDoList' && newToDoItem.trim() === '') return;

    try {
      const userListCollection = collection(db, "users", user.uid, listType);

      await addDoc(userListCollection, {
        name: listType === 'groceryList' ? newGroceryItem : newToDoItem,
        timestamp: serverTimestamp()
      });
      setNewGroceryItem('');
      setNewToDoItem('');
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, listType, id));
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="flex justify-between mb-6">
          <button onClick={() => setListType('groceryList')} className="mb-4 px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Switch to Grocery List
          </button>
          <button onClick={() => setListType('toDoList')} className="mb-4 mr-3 px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Switch to To-Do List
          </button>
        </div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">

              {listType === 'groceryList' ? (
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Grocery List</h1>
                  <form onSubmit={addItem} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={newGroceryItem}
                      onChange={(e) => setNewGroceryItem(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a new item..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </form>

                  <ul className="space-y-2">
                    {groceryItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">To-Do List</h1>
                  <form onSubmit={addItem} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={newToDoItem}
                      onChange={(e) => setNewToDoItem(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a new item..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </form>

                  <ul className="space-y-2">
                    {toDoItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

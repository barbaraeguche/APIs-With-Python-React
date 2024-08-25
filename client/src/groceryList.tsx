import { useEffect, useState } from "react";
import axios from "axios";

interface GroceryItems {
    item: string
}
const urlString: string = 'http://localhost:3000';

export default function GroceryList() {
    const [items, setItems] = useState<GroceryItems[]>([]);
    const [newItem, setNewItem] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [responseMsg, setResponseMsg] = useState<string>('');
    const [showMsg, setShowMsg] = useState<boolean>(false);
    const isUpdating: boolean = selectedItem.length > 0;

    const fetchItems = async () => {
        try {
            const { data } = await axios.get(`${urlString}/groceries`, {
                headers: { 'Content-Type': 'application/json' }
            });
            setItems(data.all_items);
        } catch (err) {
            console.error(`Error fetching items: ${err}`);
        }
    };
    useEffect(() => {
        fetchItems().then();
    }, []);
    const displayMsgAndList = (msg: string) => {
        setResponseMsg(msg);
        setShowMsg(true);
        setTimeout(() => setShowMsg(false), 3500);
        fetchItems().then();
    }

    const addItem = async () => {
        if(newItem.trim() === '') return;
        try {
            const { data } = await axios.post(
                `${urlString}/groceries/add`,
                { 'newItem': newItem },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setNewItem('');
            displayMsgAndList(data.msg);
        } catch (err) {
            console.error(`Error adding item: ${err}`);
        }
    };
    const updateItem = async (prevItem: string, nextItem: string) => {
        if(nextItem.trim() === '') return;
        try {
            const { data } = await axios.put(
                `${urlString}/groceries/update`,
                { 'prevItem': prevItem, 'nextItem': nextItem },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setSelectedItem('');
            setNewItem('');
            displayMsgAndList(data.msg);
        } catch (err) {
            console.error(`Error updating item: ${err}`);
        }
    };
    const deleteItem = async (delItem: string) => {
        try {
            const { data } = await axios.delete(
                `${urlString}/groceries/delete/${delItem}`,
                { headers: { 'Content-Type': 'application/json'} }
            );
            displayMsgAndList(data.msg);
        } catch (err) {
            console.error(`Error deleting item: ${err}`);
        }
    };

    return (
        <>
            <h3 style={{ textAlign: 'center', marginBottom: '2em' }}>Grocery List</h3>
            <ul style={{ listStyle: 'none' }}>
                {items && items.length > 0 && (
                    items.map(eachItem => (
                        <li key={eachItem.item}>
                            <div>
                                <input
                                    type="radio"
                                    onChange={() => {
                                        setSelectedItem(eachItem.item)
                                        setNewItem(eachItem.item)
                                    }}
                                    checked={selectedItem == eachItem.item}
                                />
                                {eachItem.item}
                            </div>
                            <input
                                type="checkbox"
                                onClick={() => deleteItem(eachItem.item)}
                            />
                        </li>
                    ))
                )}
            </ul>

            <input
                type="text"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
            />
            <button onClick={isUpdating? (() => updateItem(selectedItem, newItem)) : addItem}>
                {isUpdating? 'Update Item': 'Add Item'}
            </button>

            <p style={{ color: 'lightgray', marginTop: '3em', textAlign: 'center' }}>{showMsg && responseMsg}</p>
        </>
    );
}
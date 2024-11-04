import { useTranslation } from "next-i18next";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const todoUrl = "http://3.39.67.161:4000/api/todo";

const images = [
    "/o1.png",
    "/o2.png",
    "/o3.png",
    "/o4.png",
];

export default function Body() {
    const { t } = useTranslation();
    const [todoList, setTodoList] = useState([]);
    const [text, setText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [circles, setCircles] = useState([]);
    const [activeTextIndex, setActiveTextIndex] = useState(null);
    const endOfListRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(todoUrl);
            setTodoList(response.data);
            localStorage.setItem("todoList", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching todo list:", error);
        }
    };

    useEffect(() => {
        const storedTodos = localStorage.getItem("todoList");
        if (storedTodos) {
            setTodoList(JSON.parse(storedTodos));
        } else {
            fetchData();
        }
    }, []);

    useEffect(() => {
        endOfListRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, [todoList]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(todoUrl, { text });
            setText("");
            fetchData();
            setIsModalOpen(false);

            const randomImageIndex = Math.floor(Math.random() * images.length);
            const newCircle = { position: modalPosition, text, image: images[randomImageIndex] };

            setCircles((prevCircles) => [...prevCircles, newCircle]);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const handleCircleClick = (index) => {
        setActiveTextIndex(index);
    };

    const handleModalOpen = (e) => {
        if (isModalOpen) return;
        const { clientX, clientY } = e;
        setModalPosition({ x: clientX, y: clientY });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setText("");
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div
            className="flex-grow flex items-center justify-center p-4 relative"
            onClick={handleModalOpen}
            style={{ backgroundImage: 'url("/back.png")', backgroundSize: 'cover' }}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[500px] sm:h-[600px] md:h-[700px] flex flex-col items-center justify-center">
                <div className="flex-1 overflow-y-auto p-4">
                    {todoList.map((todo) => (
                        <div key={todo.id} className="flex flex-col">
                            <div className="chat chat-end">
                            </div> 
                        </div>
                    ))}
                    <div ref={endOfListRef} />
                </div>
            </div>

            {circles.map((circle, index) => (
                <img
                    key={index}
                    src={circle.image}
                    alt="Circle Image"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCircleClick(index);
                    }}
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `calc(50% + ${circle.position.x * 0.3}px)`,
                        top: `calc(50% + ${circle.position.y * 0.3}px)`,
                        cursor: "pointer",
                    }}
                />
            ))}

            {activeTextIndex !== null && (
                <div
                    className="absolute bg-white p-2 border border-gray-300 rounded shadow-lg text-xs sm:text-sm transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `calc(50% + ${circles[activeTextIndex].position.x * 0.3}px)`,
                        top: `calc(50% + ${circles[activeTextIndex].position.y * 0.3}px)`,
                    }}
                >
                    {circles[activeTextIndex].text}
                    <button
                        onClick={() => setActiveTextIndex(null)}
                        className="text-red-500 hover:text-red-700 ml-2"
                    >
                        X
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div
                    className="absolute bg-white border border-gray-300 p-4 rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `calc(50% + ${modalPosition.x * 0.3}px)`,
                        top: `calc(50% + ${modalPosition.y * 0.3}px)`,
                        width: "90%",
                        maxWidth: "300px",
                    }}
                >
                    <button
                        onClick={handleModalClose}
                        className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
                        style={{
                            borderRadius: "50%",
                        }}
                    >
                        X
                    </button>
                    <form onSubmit={onSubmitHandler}>
                        <div>
                            <input
                                name="text"
                                type="text"
                                placeholder={t("message")}
                                className="input w-full mt-4"
                                value={text}
                                onChange={handleTextChange}
                            />
                        </div>
                        <input
                            type="submit"
                            value={t("submit")}
                            className="btn w-full mt-2 bg-yellow-400 text-black rounded-lg cursor-pointer"
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

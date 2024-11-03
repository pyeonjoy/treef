import { useTranslation } from "next-i18next";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const todoUrl = "http://43.203.126.244:4000/api/todo";

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
        } catch (error) {
            console.error("Error fetching todo list:", error);
        }
    };

    useEffect(() => {
        fetchData(); // 컴포넌트가 마운트될 때 todo 목록을 가져옵니다.
    }, []);

    useEffect(() => {
        endOfListRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, [todoList]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(todoUrl, { text });
            setText(""); // 입력 필드 초기화
            fetchData(); // 데이터베이스에서 최신 todo 리스트를 가져옵니다.
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
        setText(""); // 모달을 닫을 때 입력 필드 초기화
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <>
            <div className="flex-grow flex items-center justify-center p-4" onClick={handleModalOpen} style={{ backgroundImage: 'url("/back.png")', backgroundSize: 'cover' }}>
                <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[600px] md:h-[700px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4">
                        {todoList.map((todo) => (
                            <div key={todo.id} className="flex flex-col">
                                <div className="chat chat-end">
                                    {/* TODO: 여기서 todo 항목을 표시 */}
                                    <div>{todo.text}</div>
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
                        style={{
                            position: "absolute",
                            left: circle.position.x - 25,
                            top: circle.position.y - 25,
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                        }}
                    />
                ))}

                {activeTextIndex !== null && (
                    <div
                        style={{
                            position: "absolute",
                            left: circles[activeTextIndex].position.x + 60,
                            top: circles[activeTextIndex].position.y - 25,
                            backgroundColor: "white",
                            padding: "8px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "4px",
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
                        style={{
                            position: "absolute",
                            left: modalPosition.x,
                            top: modalPosition.y,
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <button
                            onClick={handleModalClose}
                            className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
                            style={{
                                marginRight: "7px",
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
                                    className="input w-full"
                                    value={text}
                                    style={{
                                        marginTop: "30px",
                                    }}
                                    onChange={handleTextChange}
                                />
                            </div>
                            <input
                                type="submit"
                                value={t("submit")}
                                className="btn"
                                style={{
                                    backgroundColor: "yellow",
                                    color: "black",
                                    width: "100%",
                                    border: "none",
                                    borderRadius: "14px",
                                    padding: "2px",
                                    cursor: "pointer",
                                    marginTop: "8px",
                                }}
                            />
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

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
            // 데이터가 성공적으로 로드되면 로컬 스토리지에 저장
            localStorage.setItem("todoList", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching todo list:", error);
        }
    };

    useEffect(() => {
        // 로컬 스토리지에 저장된 데이터가 있다면 먼저 로드
        const storedTodos = localStorage.getItem("todoList");
        if (storedTodos) {
            setTodoList(JSON.parse(storedTodos));
        } else {
            fetchData(); // 데이터가 없다면 서버에서 가져오기
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
            fetchData(); // 데이터베이스에서 최신 todo 리스트를 가져옵니다.
            setIsModalOpen(false);

            const randomImageIndex = Math.floor(Math.random() * images.length);
            const newCircle = { position: modalPosition, text, image: images[randomImageIndex] };

            setCircles((prevCircles) => [...prevCircles, newCircle]);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // 이하 생략
}

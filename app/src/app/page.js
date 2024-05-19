import Mode from "./api/Mode";


export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <Mode />
            <p className="absolute bottom-10 text-gray-500">
                Made by
                <a href='https://jeremynguyen.dev' className="text-blue-100" target='_blank'> jeremy nguyen</a>
            </p>
        </main>
    );
}

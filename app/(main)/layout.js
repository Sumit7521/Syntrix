import Sidebar from "@/components/Sidebar";

export default function MainLayout({ children }) {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content bg-white">
                {children}
            </main>
        </div>
    );
}

import Sidebar from "./components/sidebar/page";

export default function Home() {
  return (
    <Sidebar>
      <h1 className="text-3xl font-bold mb-4 bg-green-200">Welcome to Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-200 rounded">Card 1</div>
        <div className="p-4 bg-gray-200 rounded">Card 2</div>
        <div className="p-4 bg-gray-200 rounded">Card 3</div>
      </div>
    </Sidebar>
  );
}

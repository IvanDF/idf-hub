import HomeScene from "@/components/home/HomeScene";
import Terminal from "@/components/home/Terminal";

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <HomeScene />
      <Terminal />
    </div>
  );
}

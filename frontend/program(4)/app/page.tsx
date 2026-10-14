import { redirect } from 'next/navigation';

export default function Home() {
  // 重定向到静态 HTML 页面
  redirect('/index.html');
}

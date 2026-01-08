import { MainForm } from "./layout/MainForm";
import { ToastProvider } from "../hooks/useToast";

export function App() {
	return (
		<ToastProvider>
			<MainForm />
		</ToastProvider>
	);
}

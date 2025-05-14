import './App.css';
import './axios.ts';
import { Toaster } from './components/ui/toaster.tsx';
import './dayjs.ts';
import AuthProvider from './providers/AuthProvider';
import ColorProvider from './providers/ColorProvider.tsx';
import ThemeProvider from './providers/ThemeProvider.tsx';
import Routes from './routes';

function App() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<ColorProvider>
					<Routes />
					<Toaster />
				</ColorProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;

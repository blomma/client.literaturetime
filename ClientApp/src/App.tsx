import { LiteratureTime } from "./LiteratureTime";
import { LiteratureTimeProvider } from "./LiteratureTimeProvider";

export const App = () => {
    return (
        <main>
            <LiteratureTimeProvider>
                <LiteratureTime />
            </LiteratureTimeProvider>
        </main>
    );
};

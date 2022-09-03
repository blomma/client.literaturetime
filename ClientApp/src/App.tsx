import { LiteratureTime } from "./LiteratureTime";
import React, { useEffect } from "react";
import { LiteratureTimeProvider } from "./UseLiteratureTime";

interface Time {
    hour: string;
    minute: string;
}

export const App = () => {
    const [time, setTime] = React.useState<Time | undefined>(undefined);

    useEffect(() => {
        var date = new Date();
        let hour = `${date.getHours()}`.padStart(2, "0");
        let minute = `${date.getMinutes()}`.padStart(2, "0");

        setTime({
            hour: hour,
            minute: minute,
        });
    }, []);

    return (
        <main>
            {time !== undefined && (
                <LiteratureTimeProvider hour={time.hour} minute={time.minute}>
                    <LiteratureTime />
                </LiteratureTimeProvider>
            )}
        </main>
    );
};

import "./Header.css";

interface HeaderProps {
    pageTitle: string;
}

export function Header({ pageTitle }: HeaderProps) {
    return (
        <header className="Header">
            <h1 className="site-title"><a href="/">Pulse</a></h1>
            {
                pageTitle ? (
                    <>
                        <span className="delimiter">-</span>
                        <h2 className="page-title">{pageTitle}</h2>
                    </>
                )
                    :
                    <></>
            }
        </header>
    )
}


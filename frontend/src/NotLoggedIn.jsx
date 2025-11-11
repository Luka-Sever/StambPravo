
export default function NotLoggedIn({notLoggedIn}) {
    if (notLoggedIn){
        return (
                <div id="notLoggedIn">
                    <p>Niste prijavljeni! Prijavite se za pristup aplikaciji.</p>
                    <button>Prijavi se</button>
                </div>
            );
    }
    return null;
}
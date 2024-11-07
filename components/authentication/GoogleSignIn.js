// components/Authentication/GoogleSignIn.js

import Image from 'next/image';

export function GoogleSignIn({ style }) {
    const googleAuth = process.env.NEXT_PUBLIC_GOOGLE_AUTH === 'true';

    if (googleAuth) return (
        <>
            <h2 className={style.or}>or</h2>
            <button className={style.gsiMaterialButton}>
                <div className={style.gsiMaterialButtonState}></div>
                <div className={style.gsiMaterialButtonContentWrapper}>
                    <div className={style.gsiMaterialButtonIcon}>
                        <Image src="/assets/authentication/GoogleAuth.svg" width={20} height={20} alt="Google" />
                    </div>
                    <span style={{ display: "none" }}>Sign in with Google</span>
                </div>
            </button>
        </>
    )
    else return (
        <div style={{ marginTop: "80px" }} />
    )
}


"use client";

import React, { useEffect, useState } from 'react';
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

const ArtistPage = () => {
    const [session, setSession] = useState(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data } = await authClient.getSession();
                setSession(data);
            } catch (error) {
                console.error('Failed to fetch session:', error);
            } finally {
                setIsPending(false);
            }
        };
        getSession();
    }, []);

    return (
        <div>
            {isPending ? (
                <p>Loading...</p>
            ) : session ? (
                <p>Welcome, {session.user.name}!</p>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default ArtistPage;
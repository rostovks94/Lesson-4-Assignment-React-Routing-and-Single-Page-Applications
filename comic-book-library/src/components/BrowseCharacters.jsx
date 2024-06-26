import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const BrowseCharacters = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const publicKey = '82837df1276cd185bdf016d985986c27';
    const privateKey = '8506a33eb6e932569bc5122e4c181debecf7a0f2';

    useEffect(() => {
        const fetchCharacters = async () => {
            const ts = new Date().getTime();
            const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
            const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCharacters(data.data.results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Browse Characters</h2>
            <ul>
                {characters.map(character => (
                    <li key={character.id}>
                        <Link to={`/character-details/${character.id}`}>{character.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BrowseCharacters;
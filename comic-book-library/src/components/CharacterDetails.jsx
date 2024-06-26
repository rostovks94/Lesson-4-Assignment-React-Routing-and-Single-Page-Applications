import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const CharacterDetails = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const publicKey = '82837df1276cd185bdf016d985986c27';
    const privateKey = '8506a33eb6e932569bc5122e4c181debecf7a0f2';

    useEffect(() => {
        const fetchCharacter = async () => {
            const ts = new Date().getTime();
            const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
            const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCharacter(data.data.results[0]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>{character.name}</h2>
            <p>{character.description}</p>
            {character.thumbnail && (
                <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
            )}
        </div>
    );
};

export default CharacterDetails;
import axios from "axios";
import { Request, Response } from "express";

export const getTriviaQuestions = async (req: Request, res: Response ) => {
    try {
        const { amount = 5, category, difficulty } = req.query;

        let apiUrl = 'https://opentdb.com/api.php?amount=${amount}&type=multiple' ;

        if (category) apiUrl += '&category=${category}';
        if (difficulty) apiUrl += '&difficulty=${difficulty}';

        const response = await axios.get(apiUrl);

        res.status(200).json({
            success: true,
            data: response.data.results,
        });
    } catch (error) {
            console.error("Error fetching trivia questions:", error);
            res.status(500).json({
                success: false,
                message:"Failed to fetch trivia questions",
            });
        }   
    };

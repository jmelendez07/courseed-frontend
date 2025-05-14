enum REACTION {
    GOOD = '😀',
    REGULAR = '😐',
    BAD = '😠'
}

enum REACTION_TEXT {
    GOOD = 'GOOD',
    REGULAR = 'REGULAR',
    BAD = 'BAD'
}

const reactionToTextMap: Record<REACTION, REACTION_TEXT> = {
    [REACTION.GOOD]: REACTION_TEXT.GOOD,
    [REACTION.REGULAR]: REACTION_TEXT.REGULAR,
    [REACTION.BAD]: REACTION_TEXT.BAD
};

function getReactionText(emoji: REACTION): REACTION_TEXT {
    return reactionToTextMap[emoji];
}

export default REACTION;
export { REACTION_TEXT, getReactionText }
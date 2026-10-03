function safeName(prenom: string): string { return prenom.trim() || 'Yahia' }

export function simulationIntro(prenom: string): string {
  return `Tu vas jouer un entretien de recrutement. ${safeName(prenom)}, réponds comme le jour J, avec tes mots et sans chercher à réciter. À chaque étape, prends le temps de répondre jusqu’au bout.`
}

export function friendModeInstructions(prenom: string): string {
  return `Ton ami lit la question, coche ce qu’il entend et ne souffle pas la réponse. ${safeName(prenom)} répond comme le jour J, avec ses mots.`
}

export const SIMULATION_INTRO = simulationIntro('Yahia')
export const FRIEND_MODE_INSTRUCTIONS = friendModeInstructions('Yahia')
export const SIMULATION_AMI_INTRO = FRIEND_MODE_INSTRUCTIONS

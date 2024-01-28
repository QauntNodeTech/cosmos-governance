import { TelegramChatId, TelegramToken } from "../config/env.js";
import {setupJobs} from "../jobs/index.js";

import { Telegraf } from "telegraf";
export const bot = new Telegraf(TelegramToken);

export async function setupTelegram() {
    setupJobs(); 
}

export async function sendMessage(message) {
    try {
        await bot.telegram.sendMessage(TelegramChatId, message);
    } catch (error) {
        console.log('sendMessage error', error);
    }
}

export async function sendProposalToTelegram(proposal, chain) {
    const cliMessage = '${chain.binaryName} tx gov vote ${proposal.id} yes --chain-id ${chain.chainId} --from [your_key]';

    const fields = '';
    if (proposal.type?.includes('SoftwareUpgradeProposal')) {
        fields += 'Version: ' + proposal.plan?.name + '\n';
        fields += 'Target Height: ' + proposal.plan?.height + '\n';

        if (proposal.plan?.info) {
            const infoJson = JSON.parse(proposal.plan?.info);
            if (infoJson?.binaries) {
                let text = '';
                for (const key of Object.keys(infoJson.binaries)) {
                    text += `${key}: ${infoJson.binaries[key]}\n`;
                }
                fields += 'Binaries: ' + text + '\n';
            }
        }
    }

    const url = chain.proposalUrl?.replace('{id}', proposal.id);

    let description = proposal.description?.replace(/`/g, '\\`') ?? "";
    if (description.length > 200) {
        description = description.substring(0, 200) + ' ...';
    }

    const TGmessage =   chain.name + ": " + proposal.title + '\n' +
                        'ID: ' + proposal.id.toString() + ' ' + url + '\n' +
                        description + '\n' +
                        fields +
                        'Submit Time: ' + proposal.submitTime.toUTCString() + '\n' +
                        'Voting Until: ' + proposal.votingEndTime.toUTCString() + '\n';

    await sendMessage(TGmessage);
}

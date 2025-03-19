use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
};

// Define the program's entry point
entrypoint!(process_instruction);

// Instruction types
pub enum PromptInstruction {
    StorePrompt { title: String, content: String, price: u64 },
    BuyPrompt { prompt_id: u64 },
}

// Prompt data structure
#[derive(Debug)]
pub struct Prompt {
    pub owner: Pubkey,
    pub title: String,
    pub content: String,
    pub price: u64,
    pub is_listed: bool,
}

// Process incoming instructions
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = match instruction_data[0] {
        0 => {
            let title = String::from_utf8(instruction_data[1..21].to_vec()).map_err(|_| ProgramError::InvalidInstructionData)?;
            let content = String::from_utf8(instruction_data[21..41].to_vec()).map_err(|_| ProgramError::InvalidInstructionData)?;
            let price = u64::from_le_bytes(instruction_data[41..49].try_into().unwrap());
            PromptInstruction::StorePrompt { title, content, price }
        }
        1 => {
            let prompt_id = u64::from_le_bytes(instruction_data[1..9].try_into().unwrap());
            PromptInstruction::BuyPrompt { prompt_id }
        }
        _ => return Err(ProgramError::InvalidInstructionData),
    };

    match instruction {
        PromptInstruction::StorePrompt { title, content, price } => store_prompt(accounts, title, content, price),
        PromptInstruction::BuyPrompt { prompt_id } => buy_prompt(accounts, prompt_id),
    }
}

// Store a new prompt
fn store_prompt(accounts: &[AccountInfo], title: String, content: String, price: u64) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let prompt_account = next_account_info(accounts_iter)?;

    // Check if the creator is the signer
    if !creator.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let prompt = Prompt {
        owner: *creator.key,
        title,
        content,
        price,
        is_listed: true,
    };

    prompt_account.data.borrow_mut().copy_from_slice(&bincode::serialize(&prompt).unwrap());

    msg!("Prompt stored successfully!");
    Ok(())
}

// Buy a prompt
fn buy_prompt(accounts: &[AccountInfo], prompt_id: u64) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let buyer = next_account_info(accounts_iter)?;
    let seller = next_account_info(accounts_iter)?;
    let prompt_account = next_account_info(accounts_iter)?;

    if !buyer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut prompt: Prompt = bincode::deserialize(&prompt_account.data.borrow()).unwrap();
    if !prompt.is_listed {
        return Err(ProgramError::InvalidAccountData);
    }

    let amount = prompt.price;

    // Transfer funds
    invoke(
        &system_instruction::transfer(buyer.key, seller.key, amount),
        &[buyer.clone(), seller.clone()],
    )?;

    // Transfer ownership
    prompt.owner = *buyer.key;
    prompt.is_listed = false;
    prompt_account.data.borrow_mut().copy_from_slice(&bincode::serialize(&prompt).unwrap());

    msg!("Prompt purchased successfully!");
    Ok(())
}

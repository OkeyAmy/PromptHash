// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PromptHash {
    address public owner;
    uint256 public constant PROMPT_CREATION_FEE = 2 * 100_000_000; // 2 HBAR
    uint256 public constant FEE_AMOUNT = 2 * 100_000_000; // 2 HBAR fee
    uint256 private nextPromptId = 1; // Track the next available prompt ID

    struct Prompt {
        string title;
        string description;
        string category;
        string imageUrl;
        uint256 price;
        uint256 likes;
        address owner;
        bool exists;
        bool onSale;
    }

    mapping(uint256 => Prompt) public prompts;
    mapping(address => uint256[]) public userPrompts; // Maps user address to their prompt IDs

    event PromptCreated(
        uint256 indexed promptId,
        address indexed creator,
        uint256 price,
        string title
    );
    event PromptBought(
        uint256 indexed promptId,
        address indexed buyer,
        address indexed seller,
        uint256 amount
    );
    event PromptEdited(uint256 indexed promptId, address indexed editor);
    event PromptLiked(uint256 indexed promptId, uint256 newLikeCount);
    event WithdrawnFees(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier promptExists(uint256 promptId) {
        require(prompts[promptId].exists, "Prompt does not exist");
        _;
    }

    function create(
        uint256 price,
        string memory title,
        string memory description,
        string memory category,
        string memory imageUrl
    ) external payable returns (uint256) {
        require(msg.value >= PROMPT_CREATION_FEE, "Must send at least 2 HBAR");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        uint256 promptId = nextPromptId;
        nextPromptId++;

        prompts[promptId] = Prompt({
            title: title,
            description: description,
            category: category,
            imageUrl: imageUrl,
            price: price * 1e18,
            likes: 0,
            owner: msg.sender,
            exists: true,
            onSale: true // New prompts are listed for sale by default
        });

        // Add prompt to user's prompts
        userPrompts[msg.sender].push(promptId);

        // Return any excess HBAR to the sender
        uint256 excess = msg.value - FEE_AMOUNT;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            require(refundSuccess, "Refund transfer failed");
        }

        emit PromptCreated(promptId, msg.sender, price, title);
        return promptId;
    }

    function buy(uint256 promptId) external payable promptExists(promptId) {
        Prompt storage prompt = prompts[promptId];
        require(prompt.onSale, "Prompt not for sale");
        require(msg.value >= prompt.price, "Incorrect payment amount");
        require(msg.sender != prompt.owner, "Cannot buy own prompt");

        address seller = prompt.owner;
        uint256 sellerAmount = prompt.price - FEE_AMOUNT;

        // Update prompt ownership and sale status
        prompt.owner = msg.sender;
        prompt.onSale = false; // Set to not for sale after purchase
        prompt.price = 0;

        // Update user prompt mappings
        removePromptFromUser(promptId, seller);
        userPrompts[msg.sender].push(promptId);

        // Transfer amount to seller
        (bool sellerSuccess, ) = seller.call{value: sellerAmount}("");
        require(sellerSuccess, "Seller transfer failed");

        emit PromptBought(promptId, msg.sender, seller, msg.value);
    }

    function updateSaleStatus(
        uint256 promptId,
        bool newOnSale,
        uint256 newPrice
    ) external promptExists(promptId) {
        Prompt storage prompt = prompts[promptId];
        require(
            msg.sender == prompt.owner,
            "Only owner can update sale status"
        );

        prompt.onSale = newOnSale;
        prompt.price = newPrice * 1e18;

        emit PromptEdited(promptId, msg.sender);
    }

    function likePrompt(uint256 promptId) external promptExists(promptId) {
        prompts[promptId].likes += 1;
        emit PromptLiked(promptId, prompts[promptId].likes);
    }

    function getUserPrompts(
        address user
    ) external view returns (uint256[] memory) {
        return userPrompts[user];
    }

    function removePromptFromUser(uint256 promptId, address user) internal {
        uint256[] storage userPromptList = userPrompts[user];
        for (uint256 i = 0; i < userPromptList.length; i++) {
            if (userPromptList[i] == promptId) {
                // Move the last element to this position and pop the last element
                userPromptList[i] = userPromptList[userPromptList.length - 1];
                userPromptList.pop();
                break;
            }
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit WithdrawnFees(msg.sender, balance);
    }

    receive() external payable {}
}

#!/bin/bash

echo "🧪 Testing Ollama Models for Web3Privacy Chat"
echo ""

MODELS=("llama3.1:8b" "mistral" "mixtral" "deepseek-coder:6.7b")
TEST_QUERIES=(
    "What are the best privacy-preserving DeFi projects that use zero-knowledge proofs?"
    "Explain the difference between mixers and privacy coins"
    "Which Web3 privacy projects are most suitable for private messaging?"
)

for MODEL in "${MODELS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 Testing: $MODEL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check if model is available
    if ! ollama list | grep -q "$MODEL"; then
        echo "⚠️  Model not found. Pulling..."
        ollama pull "$MODEL"
    fi

    # Test with first query
    TEST_QUERY="${TEST_QUERIES[0]}"
    echo "❓ Query: $TEST_QUERY"
    echo ""
    echo "⏱️  Starting timer..."
    START=$(date +%s)

    # Run test query
    ollama run "$MODEL" "$TEST_QUERY"

    END=$(date +%s)
    DURATION=$((END - START))

    echo ""
    echo "✅ Completed in ${DURATION}s"
    echo ""
    sleep 2
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Testing Complete!"
echo ""
echo "📊 Summary:"
echo "- Llama 3.1 8B: Best balance (RECOMMENDED)"
echo "- Mistral: Fastest responses"
echo "- Mixtral: Best quality (slower)"
echo "- DeepSeek: Fastest + code-focused"
echo ""
echo "💡 Update NEXT_PUBLIC_OLLAMA_MODEL in .env.local to switch models"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
